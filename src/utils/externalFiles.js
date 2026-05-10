'use strict';

/**
 * External Files Utility
 * Handles parsing and transformation of Google Drive and OneDrive share links.
 */

const extractGDriveId = (url) => {
  if (!url) return null;
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/open\?id=([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
};

const extractOneDriveInfo = (url) => {
  if (!url) return null;
  // OneDrive Personal usually has a resid and authkey
  const residMatch = url.match(/resid=([a-zA-Z0-9!]+)/);
  const authkeyMatch = url.match(/authkey=([a-zA-Z0-9!_-]+)/);
  
  if (residMatch && authkeyMatch) {
    return { resid: residMatch[1], authkey: authkeyMatch[1] };
  }
  return null;
};

const getPreviewLink = (url) => {
  if (!url) return '';
  
  // Google Drive
  const gdriveId = extractGDriveId(url);
  if (gdriveId) return `https://drive.google.com/file/d/${gdriveId}/preview`;
  
  // OneDrive
  const odInfo = extractOneDriveInfo(url);
  if (odInfo) {
    return `https://onedrive.live.com/embed?resid=${odInfo.resid}&authkey=${odInfo.authkey}&em=2`;
  }

  return url; // Fallback
};

const getDownloadLink = (url) => {
  if (!url) return '';
  
  // Google Drive
  const gdriveId = extractGDriveId(url);
  if (gdriveId) return `https://drive.google.com/uc?export=download&id=${gdriveId}`;
  
  // OneDrive
  // Direct download for OneDrive is usually achieved by changing 'redir' to 'download' or using a different API
  // but for personal links, it's complex. We'll fallback to original for now or use the download parameter if possible.
  if (url.includes('onedrive.live.com')) {
    return url.replace('redir?', 'download?').replace('embed?', 'download?');
  }

  return url;
};

const isExternalLink = (url) => {
  return /drive\.google\.com/.test(url) || /onedrive\.live\.com/.test(url) || /1drv\.ms/.test(url);
};

module.exports = {
  getPreviewLink,
  getDownloadLink,
  isExternalLink,
};
