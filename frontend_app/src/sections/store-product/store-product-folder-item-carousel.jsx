import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { Image } from 'src/components/image';
import { Lightbox, useLightBox } from 'src/components/lightbox';
import {
  Carousel,
  useCarousel,
} from 'src/components/carousel';

// ----------------------------------------------------------------------

export function StoreProductFolderItemCarousel({
  images,
  maxHeight = 100,
  maxWidth = 100,
  overflow = 'inherit',
}) {
  const carousel = useCarousel({
    thumbs: {
      slidesToShow: 'auto',
    },
  });

  const [initialFiles, setInitialFiles] = useState([]);

  useEffect(() => {
    const attachments = images?.length ? [...images] : [];

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
            if (!response.data) {
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

  const slides = initialFiles?.map((img) => ({ src: img.fileUrl })) || [];

  const lightbox = useLightBox(slides);

  useEffect(() => {
    if (lightbox.open) {
      carousel.mainApi?.scrollTo(lightbox.selected, true);
    }
  }, [carousel.mainApi, lightbox.open, lightbox.selected]);

  return (
    <>
      <div style={{
        maxWidth,
        maxHeight,
        overflow,
        // overflow: 'hidden'
      }}>
        <Box sx={{ mb: 2.5, position: 'relative', display: 'flex', justifyContent: 'center' }}>
          {/* <CarouselArrowNumberButtons
            {...carousel.arrows}
            options={carousel.options}
            totalSlides={carousel.dots.dotCount}
            selectedIndex={carousel.dots.selectedIndex + 1}
            sx={{ right: 16, bottom: 16, position: 'absolute' }}
          /> */}

          <Carousel carousel={carousel} sx={{ borderRadius: 2 }}>
            {slides.slice(0, 1).map((slide) => (
              <Image
                key={slide.src}
                alt={slide.src}
                src={slide.src}
                ratio="1/1"
                onClick={() => lightbox.onOpen(slide.src)}
                sx={{
                  cursor: 'zoom-in',
                  minWidth: maxWidth,
                  maxWidth,
                  // maxHeight: 700, 
                  justifyContent: 'flex-end',
                  display: 'flex',
                  alignItems: 'center',
                  objectFit: 'contain'
                }}
              />
            ))}
          </Carousel>
        </Box>

        {/* <CarouselThumbs
          ref={carousel.thumbs.thumbsRef}
          options={carousel.options?.thumbs}
          slotProps={{ disableMask: true }}
          sx={{ width: 320 }}
        >
          {slides.map((item, index) => (
            <CarouselThumb
              key={item.src}
              index={index}
              src={item.src}
              selected={index === carousel.thumbs.selectedIndex}
              onClick={() => carousel.thumbs.onClickThumb(index)}
            />
          ))}
        </CarouselThumbs> */}
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
