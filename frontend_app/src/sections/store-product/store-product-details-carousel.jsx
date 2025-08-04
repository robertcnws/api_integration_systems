import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { Image } from 'src/components/image';
import { Lightbox, useLightBox } from 'src/components/lightbox';
import {
  Carousel,
  useCarousel,
  CarouselThumb,
  CarouselThumbs,
  CarouselArrowNumberButtons,
} from 'src/components/carousel';

// ----------------------------------------------------------------------

export function StoreProductDetailsCarousel({ images, predefinedSize = null, forceSize = false }) {
  const carousel = useCarousel({
    thumbs: {
      slidesToShow: 'auto',
    },
  });

  const [initialFiles, setInitialFiles] = useState([]);

  useEffect(() => {
    const attachments = [...images] || [];

    if (!attachments.length) {
      const defaultFile = {
        file: 'store_products/nws_reward_points_preview.png',
        name: 'Default Image',
        isNew: false,
      }
      attachments.push(defaultFile);
      // setInitialFiles([defaultFile]);
      // return;
    }
    const loadFiles = async () => {
      const loaded = await Promise.all(
        attachments.map(async (attachment) => {
          if (attachment instanceof File) {
            return {
              ...attachment,
              fileUrl: URL.createObjectURL(attachment),
              name: attachment.name,
              isNew: true,
            };
          }
          if (!attachment.file) {
            return attachment;
          }
          try {
            const response = await axiosInstanceBackend.get(endpoints.rewardPoints.getFileUrl(attachment.file));
            if (!response.data || !response.data.url) {
              console.error('Error fetching URL', response.statusText);
              return attachment;
            }
            const values = await response.data;

            return {
              ...attachment,
              fileUrl: values.url,
              isNew: false,
            };
          } catch (error) {
            console.error('Error al obtener la URL:', error);
            return attachment;
          }
        })
      );
      setInitialFiles(loaded);
    };
    loadFiles();
  }, [images]);

  const forcedSizeSlides = forceSize ? initialFiles?.slice(0, 1) : initialFiles;

  const slides = forcedSizeSlides?.map((img) => ({ src: img.fileUrl })) || [];

  const lightbox = useLightBox(slides);

  useEffect(() => {
    if (lightbox.open) {
      carousel.mainApi?.scrollTo(lightbox.selected, true);
    }
  }, [carousel.mainApi, lightbox.open, lightbox.selected]);

  return (
    <>
      <div>
        <Box sx={{ mb: 2.5, position: 'relative', display: 'flex', justifyContent: 'center' }}>
          {slides.length > 1 && (
            <CarouselArrowNumberButtons
              {...carousel.arrows}
              options={carousel.options}
              totalSlides={carousel.dots.dotCount}
              selectedIndex={carousel.dots.selectedIndex + 1}
              sx={{ 
                right: predefinedSize ? 100 : 16, 
                bottom: 16, 
                position: 'absolute' 
              }}
            />
          )}

          <Carousel carousel={carousel} sx={{ borderRadius: 2 }}>
            {slides.map((slide) => (
              <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 2,
              }}
                key={slide.src}
              >
                <Image
                  key={slide.src}
                  alt={slide.src}
                  src={slide.src}
                  ratio="1/1"
                  onClick={() => lightbox.onOpen(slide.src)}
                  sx={{
                    cursor: 'zoom-in',
                    minWidth: predefinedSize || 420,
                    maxWidth: predefinedSize || 420,
                    maxHeight: predefinedSize || 420,
                    justifyContent: 'flex-end',
                    display: 'flex',
                    alignItems: 'center',
                    objectFit: 'contain',
                    borderRadius: 2,
                  }}
                />
              </Box>
            ))}
          </Carousel>
        </Box>

        {slides.length > 1 && (
          <CarouselThumbs
            ref={carousel.thumbs.thumbsRef}
            options={carousel.options?.thumbs}
            slotProps={{ disableMask: true }}
            sx={{ width: predefinedSize || 420, }}
          >
            {slides.map((item, index) => (
              <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 2,
              }}
                key={item.src}
              >
                <CarouselThumb
                  key={item.src}
                  index={index}
                  src={item.src}
                  selected={index === carousel.thumbs.selectedIndex}
                  onClick={() => carousel.thumbs.onClickThumb(index)}
                />
              </Box>
            ))}
          </CarouselThumbs>
        )}
      </div>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        onGetCurrentIndex={(index) => lightbox.setSelected(index)}
      />
    </>
  );
}
