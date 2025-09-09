import logger from '../config/logger.js';

function toArray(input) {
  if (input === undefined || input === null) return [];
  if (Array.isArray(input)) return input;
  if (typeof input === 'string') {
    const raw = input.trim();
    if (raw.length === 0) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    const sanitized = raw.replace(/^\[|\]$/g, '');
    return sanitized
      .split(',')
      .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
  }
  return [String(input)];
}

export function normalizeStudentRegistration(req, _res, next) {
  try {
    // Map possible alternate keys coming from form submissions
    const body = req.body || {};

    // skills / interests can arrive as JSON string, CSV string, or array
    if (body.skills !== undefined) body.skills = toArray(body.skills);
    if (body['skills[]'] !== undefined) body.skills = toArray(body['skills[]']);

    if (body.interests !== undefined) body.interests = toArray(body.interests);
    if (body['interests[]'] !== undefined) body.interests = toArray(body['interests[]']);

    // gender: accept common variants from UI
    if (body.gender !== undefined && body.gender !== null && body.gender !== '') {
      const gv = String(body.gender).trim().toLowerCase();
      if (gv === 'male') body.gender = 'MALE';
      else if (gv === 'female') body.gender = 'FEMALE';
      else if (gv === 'other') body.gender = 'OTHER';
      else if (['prefernottosay','prefer_not_to_say','prefer-not-to-say','prefer not to say'].includes(gv)) {
        body.gender = 'PREFER_NOT_TO_SAY';
      }
    }

    // graduationYear: allow empty string
    if (body.graduationYear === '') body.graduationYear = null;

    req.body = body;
    next();
  } catch (err) {
    logger.warn('Normalization middleware error', { error: err.message });
    next();
  }
}
