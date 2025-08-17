/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const path = require('node:path');
const getStream = require('get-stream');
const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const previewEmail = require('preview-email');
const _ = require('#helpers/lodash');

const { Users, Inquiries } = require('#models');
const config = require('#config');
const emailHelper = require('#helpers/email');
const InquiryApi = require('#helpers/inquiry-api');

// Helper function to get configured InquiryApi instance
async function getInquiryApi(ctx) {
  // For admin operations, we need to use the support email alias credentials
  // In a real implementation, you would:
  // 1. Look up the support email alias in the database
  // 2. Get the generated username/password for that alias
  // 3. Use those credentials for Email API calls
  
  const inquiryApiConfig = {
    apiUrl: config.urls.api,
    supportEmail: config.supportEmail,
    // TODO: These need to be configured with actual values:
    apiKey: process.env.FORWARD_EMAIL_API_KEY, // For /v1/emails endpoint
    aliasUsername: process.env.SUPPORT_ALIAS_USERNAME, // For /v1/messages endpoint  
    aliasPassword: process.env.SUPPORT_ALIAS_PASSWORD  // For /v1/messages endpoint
  };

  // Debug logging for configuration
  console.log('InquiryApi Configuration:', {
    apiUrl: inquiryApiConfig.apiUrl,
    supportEmail: inquiryApiConfig.supportEmail,
    hasApiKey: !!inquiryApiConfig.apiKey,
    hasAliasUsername: !!inquiryApiConfig.aliasUsername,
    hasAliasPassword: !!inquiryApiConfig.aliasPassword,
    envVars: {
      FORWARD_EMAIL_API_KEY: process.env.FORWARD_EMAIL_API_KEY ? 'SET' : 'NOT_SET',
      SUPPORT_ALIAS_USERNAME: process.env.SUPPORT_ALIAS_USERNAME ? 'SET' : 'NOT_SET',
      SUPPORT_ALIAS_PASSWORD: process.env.SUPPORT_ALIAS_PASSWORD ? 'SET' : 'NOT_SET'
    }
  });

  const inquiryApi = new InquiryApi(inquiryApiConfig);
  
  // Log the final configuration (without sensitive data)
  ctx.logger.debug('InquiryApi Debug Config:', inquiryApi.debugConfig());
  
  return inquiryApi;
}

async function list(ctx) {
  try {
    const searchQuery = ctx.query.q || '';
    const page = parseInt(ctx.query.page, 10) || 1;
    const limit = Math.min(parseInt(ctx.query.limit, 10) || 10, 50);
    
    let sort = 'internal_date';
    if (ctx.query.sort) {
      sort = ctx.query.sort.startsWith('-') 
        ? ctx.query.sort.slice(1) 
        : ctx.query.sort;
    }

    // Get messages from Email API - filter by folder and resolution status
    const apiParams = {
      page,
      limit,
      sort: sort === 'created_at' ? 'internal_date' : sort
    };

    // Add search if provided
    if (searchQuery) {
      apiParams.q = searchQuery;
    }

    // Handle status filtering - start with more permissive approach for debugging
    if (ctx.query.status === 'resolved') {
      // Show resolved messages from Archive folder
      apiParams.folder = 'Archive';
    } else {
      // For now, don't restrict by folder to see if we get any messages at all
      // apiParams.folder = 'INBOX';
      console.log('Removing folder restriction temporarily to debug API connectivity');
    }
    
    console.log('API Parameters:', JSON.stringify(apiParams, null, 2));

    const inquiryApi = await getInquiryApi(ctx);
    let messages = [];
    let pagination = { page: 1, pageCount: 1, itemCount: 0, pageSize: 0 };
    
    try {
      const apiResult = await inquiryApi.listMessages(apiParams);
      messages = apiResult.messages;
      pagination = apiResult.pagination;
      
      console.log('Email API result:', {
        messageCount: messages?.length || 0,
        hasMessages: messages && messages.length > 0
      });
    } catch (apiError) {
      console.log('Email API failed, falling back to MongoDB:', apiError.message);
      
      // Fallback to MongoDB Inquiries model
      const mongoQuery = {};
      
      // Handle search
      if (searchQuery) {
        mongoQuery.$or = [
          { subject: { $regex: searchQuery, $options: 'i' } },
          { sender_email: { $regex: searchQuery, $options: 'i' } }
        ];
      }
      
      // Handle status filtering
      if (ctx.query.status === 'resolved') {
        mongoQuery.is_resolved = true;
      } else {
        mongoQuery.is_resolved = false; // Default: show unresolved
      }
      
      console.log('MongoDB fallback query:', mongoQuery);
      
      const mongoInquiries = await Inquiries.find(mongoQuery)
        .populate('user', 'email plan')
        .sort({ created_at: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
        
      const totalCount = await Inquiries.countDocuments(mongoQuery);
      
      // Transform MongoDB results to match Email API format
      messages = mongoInquiries.map(inquiry => ({
        id: inquiry.reference,
        subject: inquiry.subject,
        from: inquiry.sender_email,
        envelope: { from: inquiry.sender_email },
        internal_date: inquiry.created_at,
        flags: inquiry.is_resolved ? ['\\Answered'] : [],
        folder_path: inquiry.is_resolved ? 'Archive' : 'INBOX',
        text: inquiry.messages?.[0]?.text || '',
        has_attachment: false,
        thread_id: inquiry.reference,
        // Include user data for plan lookup
        user: inquiry.user
      }));
      
      pagination = {
        page,
        pageCount: Math.ceil(totalCount / limit),
        itemCount: totalCount,
        pageSize: limit
      };
      
      console.log('MongoDB fallback result:', {
        messageCount: messages.length,
        totalCount,
        pagination
      });
    }
    
    console.log('API Response:', {
      messageCount: messages?.length || 0,
      pagination,
      firstMessage: messages?.[0] ? {
        id: messages[0].id,
        subject: messages[0].subject,
        from: messages[0].from,
        folder: messages[0].folder
      } : null
    });

    // Transform messages to match existing inquiry format
    const inquiries = await Promise.all(
      messages.map(async (message) => {
        // Enhanced sender email extraction with detailed logging
        const isMongoData = message.from && typeof message.from === 'string' && !message.envelope;
        
        if (!isMongoData) {
          console.log(`\n=== DEBUG: Message ${message.id} sender extraction ===`);
          console.log('Full message object keys:', Object.keys(message));
          console.log('message.envelope:', JSON.stringify(message.envelope, null, 2));
          console.log('message.from:', JSON.stringify(message.from, null, 2));
          console.log('message.headers (sample):', {
            from: message.headers?.from,
            'return-path': message.headers?.['return-path'],
            sender: message.headers?.sender,
            'reply-to': message.headers?.['reply-to']
          });
        }
        
        let senderEmail = null;
        let extractionMethod = null;
        
        // Handle MongoDB data directly (simpler format)
        if (isMongoData) {
          senderEmail = message.from;
          extractionMethod = 'mongo_from_field';
          console.log(`✓ MongoDB data - sender: ${senderEmail}`);
        }
        // Try multiple extraction methods with logging for Email API data
        else if (message.envelope?.from) {
          senderEmail = Array.isArray(message.envelope.from) ? message.envelope.from[0] : message.envelope.from;
          extractionMethod = 'envelope.from';
          console.log(`✓ Found via ${extractionMethod}:`, senderEmail);
        } else if (message.from) {
          if (typeof message.from === 'string') {
            senderEmail = message.from;
            extractionMethod = 'from (string)';
            console.log(`✓ Found via ${extractionMethod}:`, senderEmail);
          } else if (message.from.address) {
            senderEmail = message.from.address;
            extractionMethod = 'from.address';
            console.log(`✓ Found via ${extractionMethod}:`, senderEmail);
          } else if (message.from.text) {
            senderEmail = message.from.text;
            extractionMethod = 'from.text';
            console.log(`✓ Found via ${extractionMethod}:`, senderEmail);
          } else if (message.from.value && Array.isArray(message.from.value) && message.from.value[0]) {
            senderEmail = message.from.value[0].address;
            extractionMethod = 'from.value[0].address';
            console.log(`✓ Found via ${extractionMethod}:`, senderEmail);
          } else {
            console.log('✗ message.from exists but no recognizable structure:', typeof message.from, message.from);
          }
        } else {
          console.log('✗ No message.envelope.from or message.from found');
        }
        
        // Fallback: try headers
        if (!senderEmail && message.headers) {
          console.log('Trying headers fallback...');
          const headerSender = message.headers.from || message.headers['return-path'] || message.headers.sender;
          if (headerSender) {
            senderEmail = headerSender;
            extractionMethod = 'headers';
            console.log(`✓ Found via ${extractionMethod}:`, senderEmail);
          } else {
            console.log('✗ No sender info in headers either');
          }
        }
        
        // Clean up email if it contains name format
        if (senderEmail && senderEmail.includes('<')) {
          const originalEmail = senderEmail;
          const match = senderEmail.match(/<(.+)>/);
          if (match) {
            senderEmail = match[1];
            console.log(`Cleaned email format from "${originalEmail}" to "${senderEmail}"`);
          }
        }
        
        console.log(`Final extracted sender email: "${senderEmail}" via ${extractionMethod}`);
        console.log('=== END DEBUG ===\n');

        // Note: Denylist functionality removed for simplification

        // Try to find associated user or use populated data from MongoDB
        let user = null;
        let userPlan = null;
        
        if (isMongoData && message.user) {
          // Use populated user data from MongoDB
          user = message.user;
          userPlan = user.plan;
          console.log(`✓ Using populated user data: ${user.email}, plan: ${userPlan}`);
        } else if (senderEmail) {
          // Look up user for Email API data
          user = await Users.findOne({ email: senderEmail });
          userPlan = user?.plan;
          console.log(`✓ Looked up user: ${senderEmail}, found: ${!!user}, plan: ${userPlan}`);
        }

        return {
          id: message.id,
          message: message.text || message.subject,
          subject: message.subject,
          email: senderEmail,
          plan: userPlan || null,
          created_at: message.internal_date,
          updated_at: message.internal_date,
          is_resolved: message.flags?.includes('\\Answered') || message.folder_path?.includes('Archive'),
          reference: message.header_message_id,
          thread_id: message.thread_id,
          // Additional Email API fields
          folder_path: message.folder_path,
          has_attachment: message.has_attachment,
          size: message.size,
          flags: message.flags
        };
      })
    );

    if (ctx.accepts('html')) {
      return ctx.render('admin/inquiries', {
        inquiries,
        pageCount: pagination.pageCount,
        itemCount: pagination.itemCount,
        pages: paginate.getArrayPages(ctx)(6, pagination.pageCount, page)
      });
    }

    const table = await ctx.render('admin/inquiries/_table', {
      inquiries,
      pageCount: pagination.pageCount,
      itemCount: pagination.itemCount,
      pages: paginate.getArrayPages(ctx)(6, pagination.pageCount, page)
    });

    ctx.body = { table };
  } catch (err) {
    ctx.logger.error('Inquiry list error:', {
      message: err.message,
      status: err.status,
      stack: err.stack,
      query: ctx.query,
      originalError: err
    });
    
    // Log API failure but don't fall back - we're fully migrated to Email API
    if (err.status >= 500 || !err.status) {
      ctx.logger.error('Email API unavailable - check credentials and API status:', {
        error: err.message,
        status: err.status,
        response: err.response?.text
      });
      throw Boom.badGateway('Support system temporarily unavailable');
    }
    
    throw err;
  }
}

async function retrieve(ctx) {
  try {
    const messageId = ctx.params.id;
    
    // Get conversation thread from Email API
    const inquiryApi = await getInquiryApi(ctx);
    const conversationMessages = await inquiryApi.getConversationThread(messageId);
    
    if (!conversationMessages || conversationMessages.length === 0) {
      throw Boom.notFound('Inquiry not found');
    }

    const emailTemplatePath = path.join(
      config.views.root,
      'admin/inquiries/custom-email-previews.pug'
    );

    // Transform messages for display
    ctx.state.result = {
      id: messageId,
      subject: conversationMessages[0].subject,
      messages: conversationMessages,
      thread_id: conversationMessages[0].thread_id,
      is_resolved: conversationMessages.some(m => m.flags?.includes('\\Answered') || m.folder_path?.includes('Archive'))
    };

    ctx.state.messages = await Promise.all(
      conversationMessages.map(async (message) => {
        let html = null;
        
        if (message.raw) {
          html = await previewEmail(message.raw, {
            template: emailTemplatePath,
            ...config.previewEmailOptions
          });
        }

        // Enhanced message parsing
        console.log('Message from object:', JSON.stringify(message.from, null, 2));
        console.log('Message envelope:', JSON.stringify(message.envelope, null, 2));
        
        // Enhanced from address extraction - handle noreply and all address formats
        let fromAddress = null;
        let fromName = null;
        
        // Try multiple extraction methods for from address
        if (message.envelope?.from) {
          fromAddress = Array.isArray(message.envelope.from) ? message.envelope.from[0] : message.envelope.from;
        } else if (message.from) {
          if (typeof message.from === 'string') {
            fromAddress = message.from;
          } else if (message.from.address) {
            fromAddress = message.from.address;
            fromName = message.from.name;
          } else if (message.from.text) {
            fromAddress = message.from.text;
          } else if (message.from.value && Array.isArray(message.from.value) && message.from.value[0]) {
            fromAddress = message.from.value[0].address;
            fromName = message.from.value[0].name;
          }
        }
        
        // Fallback: try headers if available
        if (!fromAddress && message.headers) {
          fromAddress = message.headers.from || message.headers['return-path'];
        }
        
        // Extract name if not already found
        if (!fromName && fromAddress) {
          if (fromAddress.includes('<')) {
            // Handle "Name <email@example.com>" format
            const match = fromAddress.match(/^(.*?)\s*<(.+)>$/);
            if (match) {
              fromName = match[1].trim().replace(/^["']|["']$/g, ''); // Remove quotes
              fromAddress = match[2].trim();
            }
          }
          
          // Generate fallback name from email
          if (!fromName || fromName === '') {
            const localPart = fromAddress.split('@')[0];
            fromName = localPart === 'noreply' ? 'No Reply' : 
                      localPart === 'support' ? 'Support' :
                      localPart.charAt(0).toUpperCase() + localPart.slice(1);
          }
        }
        
        // Better fallback values - don't default to fake data
        if (!fromAddress || fromAddress === '') {
          fromAddress = 'No sender information available';
        }
        if (!fromName || fromName === '') {
          fromName = fromAddress && fromAddress !== 'No sender information available' ? 
                     fromAddress.split('@')[0].charAt(0).toUpperCase() + fromAddress.split('@')[0].slice(1) : 
                     'Unknown';
        }

        const toAddress = message.envelope?.to || 
                         message.to?.address || 
                         message.to?.text ||
                         message.to?.value?.[0]?.address ||
                         (typeof message.to === 'string' ? message.to : null);
                         
        console.log('Extracted addresses:', { fromAddress, fromName, toAddress });

        // Clean and format text content - try multiple sources
        let cleanText = message.text || 
                       message.textAsHtml || 
                       message.snippet || 
                       message.bodyText || 
                       message.body || 
                       '';
        
        console.log('Raw message structure:', {
          id: message.id,
          hasText: !!message.text,
          hasTextAsHtml: !!message.textAsHtml,
          hasHtml: !!message.html,
          hasSnippet: !!message.snippet,
          hasBodyText: !!message.bodyText,
          hasBody: !!message.body,
          hasRaw: !!message.raw,
          textLength: message.text?.length,
          textPreview: message.text?.substring(0, 300),
          htmlPreview: message.html?.substring(0, 300),
          snippet: message.snippet,
          allKeys: Object.keys(message)
        });
        
        // If no text content found but we have raw content, try to parse it
        if (!cleanText && message.raw) {
          try {
            // Parse raw email to extract text content
            const { simpleParser } = require('mailparser');
            const parsed = await simpleParser(message.raw);
            
            console.log('Parsed raw email:', {
              hasText: !!parsed.text,
              hasHtml: !!parsed.html,
              textPreview: parsed.text?.substring(0, 300),
              from: parsed.from,
              subject: parsed.subject
            });
            
            cleanText = parsed.text || parsed.textAsHtml || '';
            
            // Also update the message object with parsed content
            if (parsed.text) message.text = parsed.text;
            if (parsed.html) message.html = parsed.html;
            if (parsed.from && !message.from) message.from = parsed.from;
            if (parsed.to && !message.to) message.to = parsed.to;
          } catch (parseError) {
            console.error('Failed to parse raw email:', parseError.message);
            cleanText = 'Failed to parse email content';
          }
        }
        
        if (cleanText) {
          // Remove email headers if they appear in the text content
          const headerPatterns = [
            /^(ARC-Seal|ARC-Message-Signature|ARC-Authentication-Results|Received|X-Original-To|X-Forward-Email|DKIM-Signature|Content-Type|MIME-Version|Message-ID|Date|From|To|Subject|Reply-To):/gmi,
            /^[A-Za-z-]+:\s+.*/gm
          ];
          
          for (const pattern of headerPatterns) {
            cleanText = cleanText.replace(pattern, '');
          }
          
          // Remove excessive line breaks and clean up formatting
          cleanText = cleanText
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/^\s*\n+/, '') // Remove leading empty lines
            .trim();
          
          // If the text is still mostly headers or very short, try to extract from HTML
          if (cleanText.length < 50 || /^[A-Za-z-]+:\s+/.test(cleanText)) {
            console.log('Text appears to be headers, checking for alternative content');
            cleanText = message.textAsHtml || message.snippet || 'No readable content found';
          }
        }

        // Extract quoted content if present
        let quotedContent = null;
        let originalContent = cleanText;
        
        if (cleanText) {
          // Common patterns for quoted content
          const quotePatterns = [
            /^(.*?)(\n\s*On .* wrote:\s*\n.*)/s,
            /^(.*?)(\n\s*From:.*?\n.*)/s,
            /^(.*?)(\n\s*>.*)/s,
            /^(.*?)(\n\s*_{3,}.*)/s
          ];

          for (const pattern of quotePatterns) {
            const match = cleanText.match(pattern);
            if (match && match[1].trim().length > 0) {
              originalContent = match[1].trim();
              quotedContent = match[2].trim();
              break;
            }
          }
        }

        // Keep it simple - no complex rendering

        // Ensure we have some content to display
        let displayText = cleanText || originalContent;
        
        // Enhanced content extraction and fallback handling
        if (!displayText || displayText.trim() === '') {
          console.log('No display text found, trying fallbacks...', {
            hasHtml: !!message.html,
            hasSnippet: !!message.snippet,
            hasRaw: !!message.raw,
            htmlLength: message.html?.length,
            snippetLength: message.snippet?.length
          });
          
          if (message.html && message.html.trim() !== '') {
            // Better HTML to text conversion
            let htmlText = message.html
              .replace(/<style[^>]*>.*?<\/style>/gis, '') // Remove style tags
              .replace(/<script[^>]*>.*?<\/script>/gis, '') // Remove script tags
              .replace(/<[^>]*>/g, ' ') // Remove HTML tags
              .replace(/&nbsp;/g, ' ')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .replace(/\s+/g, ' ') // Normalize whitespace
              .trim();
            
            if (htmlText.length > 20) {
              displayText = htmlText;
              console.log('Using converted HTML text:', displayText.substring(0, 100));
            } else {
              // If conversion is too short, keep original HTML for rendering
              displayText = message.html;
              console.log('HTML conversion too short, keeping original HTML');
            }
          } else if (message.snippet && message.snippet.trim() !== '') {
            displayText = message.snippet.trim();
            console.log('Using snippet:', displayText.substring(0, 100));
          } else if (message.raw) {
            console.log('Only raw content available, parsing failed');
            displayText = '[Email content could not be parsed - raw email data available in technical details]';
          } else {
            console.log('No content found in any format');
            displayText = '[No readable content found - this message may be empty or contain only attachments]';
          }
        }

        console.log('Final message content:', {
          id: message.id,
          hasDisplayText: !!displayText,
          displayTextLength: displayText?.length,
          displayTextPreview: displayText?.substring(0, 200),
          hasOriginalContent: !!originalContent,
          originalContentLength: originalContent?.length,
          from: fromAddress,
          subject: message.subject
        });

        return {
          ...message,
          created_at: message.internal_date,
          text: displayText,
          originalContent: cleanText || displayText,
          fromAddress,
          fromName,
          toAddress,
          isSupport: fromAddress && fromAddress.includes(config.supportEmail),
          hasAttachments: message.has_attachment || (message.attachments && message.attachments.length > 0),
          isRead: message.flags?.includes('\\Seen'),
          isAnswered: message.flags?.includes('\\Answered')
        };
      })
    );

    return ctx.render('admin/inquiries/retrieve');
  } catch (err) {
    ctx.logger.error(err);
    
    // Log API failure but don't fall back - we're fully migrated to Email API
    if (err.status >= 500 || !err.status) {
      ctx.logger.error('Email API unavailable:', err);
      throw Boom.badGateway('Support system temporarily unavailable');
    }
    
    throw err;
  }
}

async function resolve(ctx) {
  try {
    const messageId = ctx.params.id;
    
    console.log('Resolve function called for messageId:', messageId);
    console.log('Request method:', ctx.method);
    console.log('Request headers:', ctx.headers);
    console.log('Request body:', ctx.request.body);
    
    let result = { success: false, moved: false };
    
    try {
      // Try Email API first
      const inquiryApi = await getInquiryApi(ctx);
      result = await inquiryApi.markAsResolved(messageId);
      console.log('Email API markAsResolved result:', result);
    } catch (apiError) {
      console.log('Email API resolve failed, trying MongoDB fallback:', apiError.message);
      
      // Fallback to MongoDB - check if this is a MongoDB inquiry by reference
      const mongoInquiry = await Inquiries.findOne({ reference: messageId });
      
      if (mongoInquiry) {
        console.log('Found MongoDB inquiry, marking as resolved:', mongoInquiry.reference);
        mongoInquiry.is_resolved = true;
        await mongoInquiry.save();
        
        result = { 
          success: true, 
          messageId, 
          resolved: true, 
          moved: false,
          source: 'mongodb'
        };
        console.log('MongoDB resolve result:', result);
      } else {
        console.log('No inquiry found in MongoDB either for reference:', messageId);
        throw new Error('Inquiry not found in either Email API or MongoDB');
      }
    }

    const successMessage = result.source === 'mongodb' 
      ? 'Inquiry marked as resolved in database'
      : result.moved 
        ? 'Inquiry resolved and moved to archive' 
        : 'Inquiry marked as resolved';

    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: successMessage,
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

    // For AJAX requests, return JSON response
    if (ctx.accepts('json') || ctx.get('X-Requested-With') === 'XMLHttpRequest') {
      ctx.body = { 
        success: true, 
        message: 'Inquiry marked as resolved',
        messageId,
        reloadPage: true 
      };
    } else {
      // For regular form submissions, redirect back
      ctx.redirect('back');
    }
  } catch (err) {
    console.error('Resolve error details:', {
      message: err.message,
      stack: err.stack,
      messageId: ctx.params.id,
      method: ctx.method,
      url: ctx.url
    });
    ctx.logger.error('Resolve error:', err);
    
    ctx.flash('custom', {
      title: ctx.request.t('Error'),
      text: 'Failed to resolve inquiry: ' + err.message,
      type: 'error',
      toast: true,
      showConfirmButton: false,
      timer: 5000,
      position: 'top'
    });

    if (ctx.accepts('json') || ctx.get('X-Requested-With') === 'XMLHttpRequest') {
      ctx.status = 500;
      ctx.body = { error: true, message: err.message, messageId: ctx.params.id };
    } else {
      ctx.redirect('back');
    }
  }
}

async function reply(ctx) {
  try {
    const messageId = ctx.params.id;
    const { body, files } = ctx.request;

    console.log('Reply function called with:', {
      messageId,
      body,
      hasFiles: !!files,
      method: ctx.method,
      path: ctx.path,
      contentType: ctx.get('content-type')
    });

    // Validate required fields
    if (!body?.message || body.message.trim() === '') {
      throw Boom.badRequest('Reply message is required');
    }

    // Handle attachments
    let attachments = [];
    if (files?.attachments) {
      attachments = await Promise.all(
        files.attachments.map(async (attachment) => {
          const content = await getStream.buffer(attachment.stream);
          return {
            filename: attachment.originalName,
            content,
            contentType: attachment.detectedMimeType
          };
        })
      );
    }

    // Get the original inquiry to extract reply information
    const inquiryApi = await getInquiryApi(ctx);
    const conversationMessages = await inquiryApi.getConversationThread(messageId);
    
    if (!conversationMessages || conversationMessages.length === 0) {
      throw Boom.notFound('Original inquiry not found');
    }

    const originalMessage = conversationMessages[0];
    
    // Extract sender information for reply
    const replyTo = originalMessage.envelope?.from || 
                   originalMessage.from?.address || 
                   originalMessage.from?.text ||
                   originalMessage.from?.value?.[0]?.address;
    
    if (!replyTo) {
      throw Boom.badRequest('Cannot determine reply address');
    }

    // Send reply via email helper (SMTP)
    const emailData = {
      template: 'inquiry-response',
      message: {
        to: replyTo,
        from: config.supportEmail,
        subject: `Re: ${originalMessage.subject || 'Your Inquiry'}`,
        replyTo: config.supportEmail
      },
      locals: {
        message: body.message,
        originalSubject: originalMessage.subject,
        supportEmail: config.supportEmail
      }
    };

    // Add attachments if present
    if (attachments && attachments.length > 0) {
      emailData.message.attachments = attachments;
    }

    await emailHelper(emailData);

    // Auto-resolve if requested (default behavior)  
    const autoResolve = body['auto-resolve'] === 'on';
    if (autoResolve) {
      await inquiryApi.markAsResolved(messageId);
    }

    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: autoResolve 
        ? 'Reply sent and inquiry marked as resolved'
        : 'Reply sent successfully',
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

    if (ctx.accepts('html')) ctx.redirect('/admin/inquiries');
    else ctx.body = { redirectTo: '/admin/inquiries' };
  } catch (err) {
    ctx.logger.error(err);
    throw Boom.badImplementation('Failed to send reply');
  }
}



module.exports = { 
  list, 
  retrieve, 
  resolve, 
  reply 
};