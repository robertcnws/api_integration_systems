import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { fileThumbnailClasses } from './classes';
import { fileData, fileThumb, fileFormat } from './utils';
import { RemoveButton, DownloadButton } from './action-buttons';


// ----------------------------------------------------------------------

export function FileThumbnail({
  sx,
  file,
  tooltip,
  onRemove,
  imageView,
  slotProps,
  onDownload,
  className,
  ...other
}) {

  const [previewUrl, setPreviewUrl] = useState(null);

  const loadBlobUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    let objectUrl;
    const resolvePreview = async () => {
      if (!file) {
        setPreviewUrl(null);
        return;
      }
      if (typeof file === 'string') {
        setPreviewUrl(file);
      } else if (file?.fileUrl) {
        try {
          objectUrl = await loadBlobUrl(file.fileUrl);
          setPreviewUrl(objectUrl);
        } catch (error) {
          console.error('Error loading blob URL:', error);
          setPreviewUrl(null);
        }
      } else if (file instanceof File) {
        objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      } else {
        setPreviewUrl(null);
      }
    };

    resolvePreview();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  if (!previewUrl) {
    return <div>Loading preview...</div>;
  }

  const { name, path } = fileData(file?.fileUrl ? file.name : file);
  const format = fileFormat(path || previewUrl);

  const renderImg = (
    <Box
      component="img"
      src={previewUrl}
      className={fileThumbnailClasses.img}
      sx={{
        width: 1,
        height: 1,
        objectFit: 'cover',
        borderRadius: 'inherit',
        ...slotProps?.img,
      }}
    />
  );

  const renderVideo = (
    <Box
      component="video"
      src={previewUrl}
      muted
      loop
      autoPlay
      playsInline
      controls={false}
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 'inherit',
        ...slotProps?.video,
      }}
    />
  );

  // PDF
  const renderPdf = (
    <Box component="embed"
      src={previewUrl}
      type="application/pdf"
      className={fileThumbnailClasses.embed}
      sx={{
        width: 1,
        height: 1,
        ...slotProps?.embed
      }} />
  );

  // Office docs
  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewUrl)}`;
  const renderOffice = (
    <iframe
      title="Office Document Viewer"
      src={officeViewerUrl}
      className={fileThumbnailClasses.iframe}
      style={{
        width: '100%',
        height: '100%',
        border: 0,
        ...slotProps?.iframe
      }}
      allowFullScreen
    />
  );

  const renderIcon = (
    <Box
      component="img"
      src={fileThumb(format)}
      className={fileThumbnailClasses.icon}
      sx={{ width: 1, height: 1, ...slotProps?.icon }}
    />
  );

  let content;
  if (imageView) {
    if (format === 'image') content = renderImg;
    else if (format === 'video') content = renderVideo;
    else if (format === 'pdf') content = renderPdf;
    else if (['word', 'excel', 'powerpoint'].includes(format)) content = renderOffice;
    else content = renderIcon;
  } else {
    content = renderIcon;
  }

  const renderContent = (
    <Box
      component="span"
      className={fileThumbnailClasses.root.concat(className ? ` ${className}` : '')}
      sx={{
        width: 36,
        height: 36,
        flexShrink: 0,
        borderRadius: 1.25,
        alignItems: 'center',
        position: 'relative',
        display: 'inline-flex',
        justifyContent: 'center',
        ...sx,
      }}
      {...other}
    >
      {content}
      {onRemove && (
        <RemoveButton
          onClick={onRemove}
          className={fileThumbnailClasses.removeBtn}
          sx={slotProps?.removeBtn}
        />
      )}

      {onDownload && (
        <DownloadButton
          onClick={onDownload}
          className={fileThumbnailClasses.downloadBtn}
          sx={slotProps?.downloadBtn}
        />
      )}
    </Box>
  );

  if (tooltip) {
    return (
      <Tooltip
        arrow
        title={name}
        slotProps={{
          popper: {
            modifiers: [{ name: 'offset', options: { offset: [0, -12] } }],
          },
        }}
      >
        {renderContent}
      </Tooltip>
    );
  }

  return renderContent;
}
