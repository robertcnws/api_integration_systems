import dayjs from 'dayjs';
import useSWR, { mutate } from 'swr';
import { useRef, useMemo, useCallback } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

import { ALL_COLORS } from 'src/_mock/__colors';

// ----------------------------------------------------------------------

const enableServer = false;

const CALENDAR_ENDPOINT = endpoints.calendar;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

export function useGetEvents() {
  const { data, isLoading, error, isValidating } = useSWR(CALENDAR_ENDPOINT, fetcher, swrOptions);

  const memoizedValue = useMemo(() => {
    const events = data?.events.map((event) => ({
      ...event,
      textColor: event.color,
    }));

    return {
      events: events || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !data?.events.length,
    };
  }, [data?.events, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProjectEvents(projects = [], type = 'installation') {
  const colorMappingRef = useRef({});
  // const usedColorsRef = useRef(new Set());

  const currentProjects = useMemo(() => projects || [], [projects]);

  const getAvailableColor = useCallback(() => {
    const index = type === 'installation' ? 2 :
      type === 'inspection' ? 1 :
        type === 'service' ? 3 :
          type === 'firstCheckMeasurement' ? 10 :
            type === 'secondCheckMeasurement' ? 12 : 0;
    return ALL_COLORS[index];
  }, [type]);

  const memoizedValue = useMemo(() => {
    const events = currentProjects.map((project) => {
      if (!colorMappingRef.current[project.id]) {
        colorMappingRef.current[project.id] = getAvailableColor();
      }
      const color = colorMappingRef.current[project.id];

      const endDate = type === 'installation' || type === 'service' ?
        dayjs(dayjs(project.endDate).format('YYYY-MM-DD')).add(23, 'hours').add(59, 'minutes').format('YYYY-MM-DD HH:mm:ss') :
        type === 'inspection' ?
          dayjs(dayjs(project.inspectionDate).format('YYYY-MM-DD')).add(23, 'hours').add(59, 'minutes').format('YYYY-MM-DD HH:mm:ss') :
          type === 'firstCheckMeasurement' ?
            dayjs(dayjs(project.firstDate).format('YYYY-MM-DD')).add(23, 'hours').add(59, 'minutes').format('YYYY-MM-DD HH:mm:ss') :
            type === 'secondCheckMeasurement' ?
              dayjs(dayjs(project.checkDate).format('YYYY-MM-DD')).add(23, 'hours').add(59, 'minutes').format('YYYY-MM-DD HH:mm:ss') :
              dayjs(dayjs(project.finishPermissionDate).format('YYYY-MM-DD')).add(23, 'hours').add(59, 'minutes').format('YYYY-MM-DD HH:mm:ss');

      return {
        ...project,
        id: project.id,
        title: project.name,
        start: type === 'installation' || type === 'service' ?
          dayjs(project.startDate).format('YYYY-MM-DD') : type === 'inspection' ?
            dayjs(project.inspectionDate).format('YYYY-MM-DD') :
            type === 'firstCheckMeasurement' ?
              project.firstDate :
              type === 'secondCheckMeasurement' ?
                project.checkDate : project.finishPermissionDate,
        end: endDate,
        textColor: color,
        color,
      };
    });

    return {
      events,
      eventsLoading: false,
    };
  }, [currentProjects, getAvailableColor, type]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createEvent(eventData) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { eventData };
    await axios.post(CALENDAR_ENDPOINT, data);
  }

  /**
   * Work in local
   */
  mutate(
    CALENDAR_ENDPOINT,
    (currentData) => {
      const currentEvents = currentData?.events;

      const events = [...currentEvents, eventData];

      return { ...currentData, events };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateEvent(eventData) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { eventData };
    await axios.put(CALENDAR_ENDPOINT, data);
  }

  /**
   * Work in local
   */
  mutate(
    CALENDAR_ENDPOINT,
    (currentData) => {
      const currentEvents = currentData?.events;

      const events = currentEvents.map((event) =>
        event.id === eventData.id ? { ...event, ...eventData } : event
      );

      return { ...currentData, events };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteEvent(eventId) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { eventId };
    await axios.patch(CALENDAR_ENDPOINT, data);
  }

  /**
   * Work in local
   */
  mutate(
    CALENDAR_ENDPOINT,
    (currentData) => {
      const currentEvents = currentData?.events;

      const events = currentEvents.filter((event) => event.id !== eventId);

      return { ...currentData, events };
    },
    false
  );
}
