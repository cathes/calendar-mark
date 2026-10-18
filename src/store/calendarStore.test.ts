import { useCalendarStore } from './calendarStore';
import type { EventInput } from '../types';

const input: EventInput = { name: 'Test event', type: 'meeting', startDate: '2026-06-25T10:00:00', endDate: '2026-06-25T11:00:00' };
beforeEach(() => useCalendarStore.setState({ events: [] }));

describe('calendar event store', () => {
  it('creates an event with a generated id and trims its name', () => {
    const result = useCalendarStore.getState().addEvent({ ...input, name: '  Test event  ' });
    expect(result.ok).toBe(true);
    expect(useCalendarStore.getState().events).toHaveLength(1);
    expect(useCalendarStore.getState().events[0]).toMatchObject({ ...input, name: 'Test event' });
    expect(useCalendarStore.getState().events[0].id).toBeTruthy();
  });
  it('does not add invalid events', () => {
    const result = useCalendarStore.getState().addEvent({ ...input, name: ' ' });
    expect(result.ok).toBe(false);
    expect(useCalendarStore.getState().events).toHaveLength(0);
  });
  it('updates an existing event and preserves its id', () => {
    useCalendarStore.getState().addEvent(input);
    const id = useCalendarStore.getState().events[0].id;
    expect(useCalendarStore.getState().updateEvent(id, { ...input, name: 'Updated' }).ok).toBe(true);
    expect(useCalendarStore.getState().events[0]).toMatchObject({ id, name: 'Updated' });
  });
  it('rejects updates for missing ids without changing state', () => {
    expect(useCalendarStore.getState().updateEvent('missing', input)).toEqual({ ok: false, error: 'This event no longer exists.' });
    expect(useCalendarStore.getState().events).toHaveLength(0);
  });
  it('deletes an event and safely ignores unknown ids', () => {
    useCalendarStore.getState().addEvent(input);
    const id = useCalendarStore.getState().events[0].id;
    useCalendarStore.getState().deleteEvent(id);
    useCalendarStore.getState().deleteEvent('missing');
    expect(useCalendarStore.getState().events).toHaveLength(0);
  });
});
