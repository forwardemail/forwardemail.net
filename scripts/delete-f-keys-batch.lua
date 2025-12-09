--[[
  Delete Fingerprint Keys Without TTL (Single Batch)
  
  Processes one batch of f:* keys without TTL and deletes them.
  Uses UNLINK for non-blocking deletion.
  
  Usage:
    redis-cli --eval delete-f-keys-batch.lua , <cursor> <batch_size>
  
  Arguments:
    ARGV[1]: cursor (default: "0")
    ARGV[2]: batch_size (default: 50000)
  
  Returns:
    {deleted_count, checked_count, next_cursor}
]]

local cursor = ARGV[1] or "0"
local batch_size = tonumber(ARGV[2]) or 50000

local deleted = 0
local checked = 0

-- Scan for f:* keys
local result = redis.call('SCAN', cursor, 'MATCH', 'f:*', 'COUNT', batch_size)
local next_cursor = result[1]
local keys = result[2]

-- Process each key
for i, key in ipairs(keys) do
  checked = checked + 1
  
  -- Check if key has no TTL
  local ttl = redis.call('TTL', key)
  
  if ttl == -1 then
    -- Use UNLINK for non-blocking deletion
    redis.call('UNLINK', key)
    deleted = deleted + 1
  end
end

-- Return results
return {deleted, checked, next_cursor}
