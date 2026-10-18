
import SiteContent from '../models/SiteContent.js';
import { defaultSiteContent } from '../config/defaultData.js';

function disableCache(res) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
}

// Keep the newest record and remove duplicate "main" records.
async function getCanonicalRecord() {
  const records = await SiteContent.find({ key: 'main' })
    .sort({ updatedAt: -1, _id: -1 });

  if (records.length === 0) {
    return null;
  }

  const canonical = records[0];
  const duplicateIds = records.slice(1).map((record) => record._id);

  if (duplicateIds.length > 0) {
    await SiteContent.deleteMany({
      _id: { $in: duplicateIds },
    });

    console.warn(
      `Removed ${duplicateIds.length} duplicate site-content record(s).`
    );
  }

  // Enforce uniqueness once existing duplicates have been removed.
  try {
    await SiteContent.collection.createIndex(
      { key: 1 },
      { unique: true, name: 'unique_site_content_key' }
    );
  } catch (error) {
    console.error('Could not ensure unique site-content index:', error.message);
  }

  return canonical;
}

export async function getSiteContent(req, res) {
  disableCache(res);

  const record = await getCanonicalRecord();

  return res.status(200).json(
    record?.content ?? defaultSiteContent
  );
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
    let record = await getCanonicalRecord();

    if (record) {
      record.content = req.body;
      await record.save();
    } else {
      record = await SiteContent.create({
        key: 'main',
        content: req.body,
      });
    }

    // Return the actual saved document, not the submitted request body.
    return res.status(200).json({
      message: 'Website content saved successfully.',
      content: record.content,
    });
  } catch (error) {
    console.error('Failed to update site content:', error);

    return res.status(500).json({
      message: 'Failed to save website content.',
    });
  }
}
