
import SiteContent from '../models/SiteContent.js';
import { defaultSiteContent } from '../config/defaultData.js';

const OLD_NAME = /Rohan\s*&\s*Company/gi;

function replaceOldName(value) {
  if (typeof value === 'string') {
    return value.replace(OLD_NAME, (match) =>
      match === match.toUpperCase()
        ? 'NORTHSTAR FINANCE'
        : 'Northstar Finance'
    );
  }

  if (Array.isArray(value)) {
    return value.map(replaceOldName);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        replaceOldName(item),
      ])
    );
  }

  return value;
}

function disableCache(res) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
}

export async function getSiteContent(req, res) {
  disableCache(res);

  let record = await SiteContent.findOne({ key: 'main' });

  if (!record) {
    return res.json(replaceOldName(defaultSiteContent));
  }

  const corrected = replaceOldName(record.content);

  if (JSON.stringify(corrected) !== JSON.stringify(record.content)) {
    record.content = corrected;
    await record.save();
  }

  return res.json(corrected);
}

export async function updateSiteContent(req, res) {
  disableCache(res);

  if (
    !req.body ||
    typeof req.body !== 'object' ||
    Array.isArray(req.body)
  ) {
    return res.status(400).json({
      message: 'A content object is required.',
    });
  }

  try {
    const content = replaceOldName(req.body);

    const record = await SiteContent.findOneAndUpdate(
      { key: 'main' },
      { $set: { content } },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.json({
      message: 'Website content saved successfully.',
      content: record.content,
    });
  } catch (error) {
    console.error('Failed to save website content:', error);

    return res.status(500).json({
      message: 'Failed to save website content.',
    });
  }
}
