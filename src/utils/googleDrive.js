'use strict';

/**
 * Google Drive Utility
 * Handles parsing, transformation, and validation of Google Drive share links.
 */

const extractFileId = (url) => {
  if (!url) return null;
  
  // Regex for various Google Drive link formats
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,       // https://drive.google.com/file/d/ID/view
    /id=([a-zA-Z0-9_-]+)/,               // https://drive.google.com/uc?id=ID
    /\/open\?id=([a-zA-Z0-9_-]+)/,       // https://drive.google.com/open?id=ID
    /\/folders\/([a-zA-Z0-9_-]+)/,       // https://drive.google.com/drive/folders/ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }

  return null;
};

const getPreviewLink = (url) => {
  const id = extractFileId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : url;
};

const getDownloadLink = (url) => {
  const id = extractFileId(url);
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
};

const isGoogleDriveLink = (url) => {
  return /drive\.google\.com/.test(url) || /docs\.google\.com/.test(url);
};

module.exports = {
  extractFileId,
  getPreviewLink,
  getDownloadLink,
  isGoogleDriveLink,
};
