const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const parser = require('mongodb-query-parser');
const nodemailer = require('nodemailer');
const Axe = require('axe');
const _ = require('#helpers/lodash');

const { Emails, Inquiries, Users } = require('#models');
const config = require('#config');
const emailHelper = require('#helpers/email');

const transporter = nodemailer.createTransport({
  streamTransport: true,
  buffer: true,
  logger: new Axe({
    silent: true
  })
});

// Enhanced list function (fixed query logic)
async function list(ctx) {
  // Build the aggregation pipeline
  const pipeline = [
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        firstMessage: {
          $ifNull: [
            {
              $arrayElemAt: [
                {
                  $sortArray: {
                    input: '$messages',
                    sortBy: { created_at: 1 }
                  }
                },
                0
              ]
            },
            {}
          ]
        },
        content: '$text',
        created_at: '$created_at',
        updated_at: '$updated_at'
      }
    },
    {
      $addFields: {
        email: { $ifNull: ['$user.email', '$sender_email'] },
        plan: { $ifNull: ['$user.plan', null] }
      }
    },
    {
      $project: {
        id: 1,
        message: { $ifNull: ['$message', '$firstMessage.text'] },
        created_at: 1,
        updated_at: 1,
        reference: 1,
        email: 1,
        plan: 1,
        is_resolved: 1,
        is_denylist: 1,
        priority: 1,
        status: 1
      }
    }
  ];

  // Build match query after all fields are available
  let matchQuery = {};

  // Handle basic search - now searching in the correct fields
  if (ctx.query.q) {
    const searchRegex = { $regex: ctx.query.q, $options: 'i' };
    const escapedRegex = { $regex: _.escapeRegExp(ctx.query.q), $options: 'i' };

    matchQuery.$or = [
      { email: searchRegex },
      { email: escapedRegex },
      { message: searchRegex },
      { message: escapedRegex }
    ];
  }

  // Filter for non-resolved inquiries
  if (!matchQuery.$or) {
    matchQuery.$or = [];
  }

  matchQuery.$or.push({ is_resolved: false });

  // Add new filtering capabilities
  if (
    ctx.query.priority &&
    ['high', 'medium', 'low'].includes(ctx.query.priority)
  ) {
    matchQuery.priority = ctx.query.priority;
  }

  if (
    ctx.query.status &&
    ['new', 'in_progress', 'resolved', 'closed'].includes(ctx.query.status)
  ) {
    matchQuery.status = ctx.query.status;
  }

  // Handle MongoDB query parser (this overrides other queries)
  if (isSANB(ctx.query.mongodb_query)) {
    try {
      matchQuery = parser.parseFilter(ctx.query.mongodb_query);
      if (!matchQuery || Object.keys(matchQuery).length === 0)
        throw new Error('Query was not parsed properly');
    } catch (err) {
      ctx.logger.warn(err);
      throw Boom.badRequest(err.message);
    }
  }

  // Add match stage after fields are available
  pipeline.push({ $match: matchQuery });

  // Handle sort
  let $sort = { created_at: -1 };
  if (ctx.query.sort) {
    const order = ctx.query.sort.startsWith('-') ? -1 : 1;
    $sort = {
      [order === -1 ? ctx.query.sort.slice(1) : ctx.query.sort]: order
    };
  }

  pipeline.push({ $sort }, { $skip: ctx.paginate.skip });
  pipeline.push({ $limit: Number.parseInt(ctx.query.limit, 10) });

  // Execute aggregation
  const [inquiries, itemCount] = await Promise.all([
    Inquiries.aggregate(pipeline).exec(),
    Inquiries.aggregate([
      ...pipeline.slice(0, -2), // Remove skip and limit for count
      { $count: 'total' }
    ])
      .exec()
      .then((result) => result[0]?.total || 0)
  ]);

  // Calculate page count (preserve existing logic)
  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  // HTML rendering (preserve existing approach)
  if (ctx.accepts('html'))
    return ctx.render('admin/inquiries', {
      inquiries,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });

  // Table rendering for AJAX (preserve existing approach)
  const table = await ctx.render('admin/inquiries/_table', {
    inquiries,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

async function updateStatus(ctx) {
  const { status } = ctx.request.body;
  const { id } = ctx.request.params;

  // Validate status
  const validStatuses = ['new', 'in_progress', 'resolved', 'closed'];
  if (!validStatuses.includes(status)) {
    throw Boom.badRequest('Invalid status value');
  }

  // Update the inquiry
  await Inquiries.findByIdAndUpdate(id, {
    status,
    updated_at: new Date()
  });

  // Flash success message
  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.request.t('Status updated successfully'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('/admin/inquiries');
  else ctx.body = { redirectTo: '/admin/inquiries' };
}

async function updatePriority(ctx) {
  const { priority } = ctx.request.body;
  const { id } = ctx.request.params;

  const validPriorities = ['low', 'medium', 'high'];
  if (!validPriorities.includes(priority)) {
    throw Boom.badRequest('Invalid priority value');
  }

  // Update the inquiry
  await Inquiries.findByIdAndUpdate(id, {
    priority,
    updated_at: new Date()
  });

  // Flash success message
  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.request.t('Priority updated successfully'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('/admin/inquiries');
  else ctx.body = { redirectTo: '/admin/inquiries' };
}

async function retrieve(ctx) {
  try {
    // Get the inquiry with user population
    const inquiry = await Inquiries.findById(ctx.params.id)
      .populate('user', 'email')
      .lean()
      .exec();

    if (!inquiry)
      throw Boom.notFound(ctx.translateError('INQUIRY_DOES_NOT_EXIST'));

    // Set inquiry in state
    ctx.state.inquiry = inquiry;

    // Build messages array from inquiry data
    const messages = [];

    // Add original inquiry message
    messages.push({
      from: inquiry.user ? inquiry.user.email : 'Customer',
      date: inquiry.created_at,
      html: inquiry.message,
      text: inquiry.message,
      message: inquiry.message,
      type: 'customer'
    });

    // Add any additional messages from inquiry.messages array
    if (inquiry.messages && Array.isArray(inquiry.messages)) {
      for (const msg of inquiry.messages) {
        messages.push({
          from: msg.from || 'Support',
          date: msg.date || msg.created_at,
          html: msg.html || msg.text || msg.message,
          text: msg.text || msg.message,
          message: msg.message,
          type: msg.type || 'support'
        });
      }
    }

    // Sort messages by date
    messages.sort((a, b) => new Date(a.date) - new Date(b.date));

    console.log('Retrieved inquiry:', inquiry.id);
    console.log('Messages count:', messages.length);

    // Render the page
    await ctx.render('admin/inquiries/retrieve', {
      inquiry,
      messages
    });
  } catch (err) {
    ctx.logger.error(err);
    ctx.flash('error', err.message);
    ctx.redirect('/admin/inquiries');
  }
}

// Enhanced create method to handle replies
async function create(ctx) {
  try {
    const { message } = ctx.request.body;

    if (!message || !message.trim()) {
      throw Boom.badRequest('Message is required');
    }

    // If this is a reply to an existing inquiry (has inquiry ID in path)
    if (ctx.params.id) {
      const inquiry = await Inquiries.findById(ctx.params.id);
      if (!inquiry) {
        throw Boom.notFound('Inquiry not found');
      }

      // Initialize messages array if it doesn't exist
      if (!inquiry.messages) {
        inquiry.messages = [];
      }

      // Add the new reply message
      const newMessage = {
        from: 'Support Team',
        date: new Date(),
        html: message,
        text: message,
        message,
        type: 'support',
        created_at: new Date()
      };

      inquiry.messages.push(newMessage);

      // Update inquiry status if it's new
      if (inquiry.status === 'new') {
        inquiry.status = 'in_progress';
      }

      inquiry.updated_at = new Date();

      // Save the inquiry
      await inquiry.save();

      console.log('Added reply to inquiry:', inquiry.id);
      console.log('New message:', newMessage);

      // Flash success message
      ctx.flash('custom', {
        title: ctx.request.t('Success'),
        text: ctx.request.t('Reply sent successfully'),
        type: 'success',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        position: 'top'
      });

      // Redirect back to the inquiry
      ctx.redirect(`/admin/inquiries/${inquiry.id}`);
      return;
    }

    // If this is a new inquiry (original create logic)
    const inquiry = await Inquiries.create({
      user: ctx.state.user._id,
      message: message.trim(),
      status: 'new',
      priority: 'medium'
    });

    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.request.t('Inquiry created successfully'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

    ctx.redirect('/admin/inquiries');
  } catch (err) {
    ctx.logger.error(err);
    ctx.flash('error', err.message);

    if (ctx.params.id) {
      ctx.redirect(`/admin/inquiries/${ctx.params.id}`);
    } else {
      ctx.redirect('/admin/inquiries');
    }
  }
}

// Enhanced reply function with rich text support
async function reply(ctx) {
  const { id } = ctx.params;
  const { message, attachments } = ctx.request.body;

  if (!message || !message.trim()) {
    throw Boom.badRequest('Message is required');
  }

  const inquiry = await Inquiries.findById(id).populate('user');

  if (!inquiry) {
    throw Boom.notFound('Inquiry not found');
  }

  // Process rich text message (convert HTML to plain text for email)
  const processedMessage = message
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**') // Bold to markdown
    .replace(/<em>(.*?)<\/em>/g, '*$1*') // Italic to markdown
    .replace(/<br\s*\/?>/g, '\n') // Line breaks
    .replace(/<p>(.*?)<\/p>/g, '$1\n\n') // Paragraphs
    .replace(/<ul>(.*?)<\/ul>/gs, '$1') // Remove ul tags
    .replace(/<li>(.*?)<\/li>/g, '• $1\n') // List items
    .replace(/<[^>]*>/g, '') // Remove remaining HTML
    .trim();

  // Send email reply (existing email logic)
  const emailData = {
    to: inquiry.sender_email,
    subject: `Re: ${inquiry.subject}`,
    text: processedMessage,
    html: message, // Send rich HTML version
    attachments: attachments || []
  };

  await emailHelper.sendEmail(emailData);

  // Update inquiry status if it was new
  if (inquiry.status === 'new') {
    await Inquiries.findByIdAndUpdate(id, {
      status: 'in_progress',
      updated_at: new Date()
    });
  }

  inquiry.messages.push({ raw });

  await inquiry.save();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('/admin/inquiries');
  else ctx.body = { redirectTo: '/admin/inquiries' };
}

async function resolve(ctx) {
  const inquiry = await Inquiries.findById(ctx.params.id);
  if (!inquiry) throw Boom.notFound(ctx.translateError('INVALID_INQUIRY'));

  await Inquiries.findByIdAndUpdate(inquiry._id, {
    $set: { is_resolved: true }
  });

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function bulkReply(ctx) {
  const { ids, message } = ctx.request.body;

  const repliedTo = new Set();

  try {
    for (const id of ids) {
      // eslint-disable-next-line no-await-in-loop
      const inquiry = await Inquiries.findById(id);
      if (!inquiry) throw Boom.notFound(ctx.translateError('INVALID_INQUIRY'));

      // eslint-disable-next-line no-await-in-loop
      const user = await Users.findById(inquiry.user);
      if (!user) {
        ctx.logger.warn('no user found, trying sender_email');
        if (!inquiry.sender_email)
          throw Boom.notFound(ctx.translateError('INVALID_USER'));
      }

      // rely on historical user.email or fall back to newer sender_email
      // for those sending direct emails instead of creating an inquiry
      const address = user?.email ?? inquiry.sender_email;

      // if the user has multiple inquiries and we've just responded
      // in bulk to a previous message then let's skip the email
      if (!repliedTo.has(address)) {
        // eslint-disable-next-line no-await-in-loop
        const { email, info } = await emailHelper({
          template: 'inquiry-response',
          message: {
            to: address,
            cc: config.email.message.from,
            inReplyTo: inquiry?.messages[inquiry.messages.length - 1] || '',
            references: inquiry.reference,
            subject: inquiry.subject
          },
          locals: {
            user: { email: address },
            inquiry,
            response: { message }
          }
        });

        let raw;
        if (email) {
          // eslint-disable-next-line no-await-in-loop
          raw = await Emails.getMessage(email.message);
        } else {
          // eslint-disable-next-line no-await-in-loop
          const obj = await transporter.sendMail(info.originalMessage);
          raw = obj.message;
        }

        inquiry.messages.push({ raw });

        // eslint-disable-next-line no-await-in-loop
        await inquiry.save();

        repliedTo.add(address);
      }
    }
  } catch (err) {
    ctx.logger.error(err);
    throw Boom.badImplementation(
      ctx.translateError('INQUIRY_RESPONSE_BULK_REPLY_ERROR')
    );
  }

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: `Successfully replied to ${repliedTo.size} inquiries!`,
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('/admin/inquiries');
  else ctx.body = { redirectTo: '/admin/inquiries' };
}

module.exports = {
  list,
  retrieve,
  create,
  updateStatus,
  updatePriority,
  reply,
  resolve,
  bulkReply
};
