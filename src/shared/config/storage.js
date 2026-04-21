import path from 'path';
import { Storage } from '@google-cloud/storage';
import config from './index.js';

const LONG_LIVED_PUBLIC_CACHE_CONTROL = 'public, max-age=31536000, immutable';
const DEFAULT_SIGNED_URL_EXPIRES_MINUTES = 60;

const getStorageConfig = (configOverride) => configOverride || config.gcs;

const createStorageClient = (configOverride) => {
    const storageConfig = getStorageConfig(configOverride);

    return new Storage({
        projectId: storageConfig.projectId,
        keyFilename: storageConfig.keyFilename,
    });
};

const getExtension = (file) => {
    const originalExtension = path.extname(file.originalname || '').toLowerCase();
    if (originalExtension) {
        return originalExtension;
    }

    const mimeExtensionMap = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'image/svg+xml': '.svg',
        'video/mp4': '.mp4',
        'video/webm': '.webm',
        'video/quicktime': '.mov',
    };

    return mimeExtensionMap[file.mimetype] || '';
};

const buildStorageObjectKey = (file, configOverride) => {
    const storageConfig = getStorageConfig(configOverride);
    const now = new Date(Date.now());
    const year = String(now.getUTCFullYear());
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    return `${storageConfig.uploadPathPrefix}/${year}/${month}/${uniqueSuffix}${getExtension(file)}`;
};

const buildPublicFileUrl = (objectKey, configOverride) => {
    const storageConfig = getStorageConfig(configOverride);
    const baseUrl = storageConfig.publicBaseUrl || `https://storage.googleapis.com/${storageConfig.bucketName}`;

    return `${baseUrl.replace(/\/+$/, '')}/${objectKey}`;
};

const normalizeStoredFileReference = (storedFileReference) => {
    if (typeof storedFileReference !== 'string') {
        return '';
    }

    return storedFileReference.trim();
};

const extractObjectKeyFromKnownPublicUrl = (storedFileReference, storageConfig) => {
    const trimmedReference = normalizeStoredFileReference(storedFileReference);
    if (!trimmedReference) {
        return null;
    }

    const publicCandidates = [
        storageConfig.publicBaseUrl,
        `https://storage.googleapis.com/${storageConfig.bucketName}`,
        `https://storage.cloud.google.com/${storageConfig.bucketName}`,
    ].filter(Boolean);

    for (const candidate of publicCandidates) {
        const normalizedCandidate = candidate.replace(/\/+$/, '');
        if (trimmedReference === normalizedCandidate) {
            return '';
        }

        if (trimmedReference.startsWith(`${normalizedCandidate}/`)) {
            return trimmedReference.slice(normalizedCandidate.length + 1);
        }
    }

    return null;
};

const resolveStoredObjectKey = (storedFileReference, configOverride) => {
    const storageConfig = getStorageConfig(configOverride);
    const trimmedReference = normalizeStoredFileReference(storedFileReference);

    if (!trimmedReference) {
        return null;
    }

    if (trimmedReference.startsWith('http://') || trimmedReference.startsWith('https://')) {
        return extractObjectKeyFromKnownPublicUrl(trimmedReference, storageConfig);
    }

    if (trimmedReference.startsWith('/')) {
        return null;
    }

    return trimmedReference;
};

const buildSignedReadUrl = async (objectKey, configOverride) => {
    const storageConfig = getStorageConfig(configOverride);
    const storage = createStorageClient(storageConfig);
    const bucket = storage.bucket(storageConfig.bucketName);
    const bucketFile = bucket.file(objectKey);
    const expiresAt = Date.now()
        + (storageConfig.signedUrlExpiresMinutes || DEFAULT_SIGNED_URL_EXPIRES_MINUTES) * 60 * 1000;
    const [signedUrl] = await bucketFile.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: expiresAt,
    });

    return signedUrl;
};

const resolveStoredFileUrl = (storedFileReference, configOverride) => {
    const trimmedReference = normalizeStoredFileReference(storedFileReference);
    if (!trimmedReference) {
        return '';
    }

    const objectKey = resolveStoredObjectKey(trimmedReference, configOverride);
    if (!objectKey) {
        return trimmedReference;
    }

    return buildSignedReadUrl(objectKey, configOverride);
};

const uploadBufferToGcs = async ({ file, objectKey, configOverride }) => {
    const storageConfig = getStorageConfig(configOverride);
    const storage = createStorageClient(storageConfig);
    const bucket = storage.bucket(storageConfig.bucketName);
    const bucketFile = bucket.file(objectKey);

    await bucketFile.save(file.buffer, {
        resumable: false,
        metadata: {
            contentType: file.mimetype,
            cacheControl: LONG_LIVED_PUBLIC_CACHE_CONTROL,
        },
    });

    return {
        objectKey,
        fileUrl: buildPublicFileUrl(objectKey, storageConfig),
    };
};

export {
    LONG_LIVED_PUBLIC_CACHE_CONTROL,
    buildStorageObjectKey,
    buildPublicFileUrl,
    resolveStoredObjectKey,
    resolveStoredFileUrl,
    uploadBufferToGcs,
};
