
import SiteContent from '../models/SiteContent.js';
import { defaultSiteContent } from '../config/defaultData.js';

function disableCache(res) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
}

export async function getSiteContent(req, res) {
  disableCache(res);

  const record = await SiteContent.findOne({ key: 'main' }).lean();

  return res.json(record?.content ?? defaultSiteContent);
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
    const record = await SiteContent.findOneAndUpdate(
      { key: 'main' },
      {
        $set: {
          content: req.body,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
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
