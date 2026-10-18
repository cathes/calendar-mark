import { useMemo, useState } from "react";
import {
  addMonths,
  addWeeks,
  format,
  isSameDay,
  isToday,
  subMonths,
  subWeeks,
} from "date-fns";

import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import SparklesIcon from "@mui/icons-material/AutoAwesome";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarGrid from "./components/CalendarGrid";
import EventModal from "./components/EventModal";
import { useCalendarStore } from "./store/calendarStore";
import type { CalendarEvent, EventInput } from "./types";

const iso = (date: Date) => format(date, "yyyy-MM-dd");
const timeLabel = (datetime: string) => {
  const [h, m] = datetime.slice(11, 16).split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};
const eventDate = (event: CalendarEvent) => event.startDate.slice(0, 10);
const typeClass = (type: string) =>
  type.toLowerCase().replace(/[^a-z0-9_-]/g, "-");


export default function App() {
  const [currentDate, setCurrentDate] = useState(() => {
    const first = useCalendarStore.getState().events[0];
    return first
      ? new Date(`${first.startDate.slice(0, 10)}T12:00:00`)
      : new Date();
  });
  const [view, setView] = useState<"month" | "week">("month");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | undefined>();
  const [draftDate, setDraftDate] = useState(iso(currentDate));
  const events = useCalendarStore((state) => state.events);
  const addEvent = useCalendarStore((state) => state.addEvent);
  const updateEvent = useCalendarStore((state) => state.updateEvent);
  const deleteEvent = useCalendarStore((state) => state.deleteEvent);
  const eventTypes = useMemo(
    () => Array.from(new Set(events.map((event) => event.type))).sort(),
    [events],
  );

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const query = search.trim().toLowerCase();
        return (
          (!query ||
            [event.name, event.type].some((value) =>
              value.toLowerCase().includes(query),
            )) &&
          (category === "All" || event.type === category)
        );
      }),
    [events, search, category],
  );
  const upcoming = useMemo(
    () =>
      [...filteredEvents]
        .filter((event) => eventDate(event) >= iso(currentDate))
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .slice(0, 4),
    [filteredEvents, currentDate],
  );

  const shift = (direction: number) =>
    setCurrentDate((date) =>
      view === "month"
        ? direction > 0
          ? addMonths(date, 1)
          : subMonths(date, 1)
        : direction > 0
          ? addWeeks(date, 1)
          : subWeeks(date, 1),
    );
  const openCreate = (date = iso(currentDate)) => {
    setEditing(undefined);
    setDraftDate(date);
    setModalOpen(true);
  };
  const openEdit = (event: CalendarEvent) => {
    setEditing(event);
    setDraftDate(event.startDate.slice(0, 10));
    setModalOpen(true);
  };
  const save = (input: EventInput) => {
    const result = editing ? updateEvent(editing.id, input) : addEvent(input);
    return result.ok ? null : (result.error ?? "Unable to save event.");
  };
  const monthLabel =
    view === "month"
      ? format(currentDate, "MMMM yyyy")
      : `${format(currentDate, "MMM d")} – ${format(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 6), "MMM d, yyyy")}`;
  const todaysEvents = events.filter(
    (event) => eventDate(event) === iso(new Date()),
  ).length;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button
          className="button primary create-sidebar"
          onClick={() => openCreate()}
        >
          <AddIcon sx={{ fontSize: 17 }} /> Create event
        </button>
        <div className="sidebar-section">
          <span className="side-label">WORKSPACE</span>
          <button className="side-link active">
            <CalendarMonthIcon sx={{ fontSize: 17 }} /> Calendar{" "}
            <span className="side-count">{events.length}</span>
          </button>
        </div>
        <div className="sidebar-section mini-calendar-section">
          <span className="side-label">QUICK JUMP</span>
          <div className="mini-cal-head">
            <button
              aria-label="Previous month"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeftIcon sx={{ fontSize: 15 }}  />
            </button>
            <strong>{format(currentDate, "MMMM yyyy")}</strong>
            <button
              aria-label="Next month"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRightIcon sx={{ fontSize: 15 }}  />
            </button>
          </div>
          <MiniCalendar
            date={currentDate}
            events={events}
            onPick={setCurrentDate}
          />
        </div>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              <SparklesIcon sx={{ fontSize: 17 }} />
            </div>
            <strong>Make room for what matters.</strong>
            <p>A little planning goes a long way.</p>
            <button onClick={() => openCreate()}>
              Plan an event <ChevronRightIcon sx={{ fontSize: 14 }} />
            </button>
          </div>
          <div className="profile-row">
            <div className="avatar">C</div>
            <div>
              <strong>Your calendar</strong>
              <span>Personal workspace</span>
            </div>
            <span className="online-dot" />
          </div>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <ChevronRightIcon sx={{ fontSize: 14 }} /> <strong>Calendar</strong>
          </div>
          <div className="topbar-right">
            <span className="today-indicator">
              <span /> {todaysEvents} events today
            </span>
            <button className="avatar small" aria-label="Profile">
              C
            </button>
          </div>
        </header>
        <div className="page-content">
          <div className="page-heading">
            <div>
              <h1>
                Calendar<span>.</span>
              </h1>
              <p>Keep the important things in view.</p>
            </div>
            <button
              className="button primary add-main"
              onClick={() => openCreate()}
            >
              <AddIcon sx={{ fontSize: 17 }}  /> New event
            </button>
          </div>
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon purple">
                <CalendarMonthIcon sx={{ fontSize: 18 }}  />
              </div>
              <div>
                <span className="stat-label">Total events</span>
                <strong>{events.length}</strong>
              </div>
              <span className="stat-note">in your calendar</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon mint">
                <AccessTimeIcon sx={{ fontSize: 18 }} />
              </div>
              <div>
                <span className="stat-label">Today</span>
                <strong>{todaysEvents}</strong>
              </div>
              <span className="stat-note">scheduled events</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon peach">
                <SparklesIcon sx={{ fontSize: 18 }} />
              </div>
              <div>
                <span className="stat-label">Coming up</span>
                <strong>{upcoming.length}</strong>
              </div>
              <span className="stat-note">next few events</span>
            </div>
          </div>

          <div className="calendar-panel">
            <div className="calendar-toolbar">
              <div className="date-controls">
                <button
                  className="today-button"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </button>
                <button
                  className="nav-button"
                  aria-label="Previous period"
                  onClick={() => shift(-1)}
                >
                  <ChevronLeftIcon sx={{ fontSize: 18 }} />
                </button>
                <button
                  className="nav-button"
                  aria-label="Next period"
                  onClick={() => shift(1)}
                >
                  <ChevronRightIcon sx={{ fontSize: 18 }}  />
                </button>
                <h2>{monthLabel}</h2>
              </div>
              <div className="calendar-actions">
                <label className="search-box">
                  <SearchIcon sx={{ fontSize: 16 }} />
                  <input
                    aria-label="Search events"
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      aria-label="Clear search"
                      onClick={() => setSearch("")}
                    >
                      ×
                    </button>
                  )}
                </label>
                <select
                  aria-label="Filter by category"
                  className="filter-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>All</option>
                  {eventTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
                <div className="view-toggle" aria-label="Calendar view">
                  <button
                    className={view === "month" ? "selected" : ""}
                    onClick={() => setView("month")}
                  >
                    Month
                  </button>
                  <button
                    className={view === "week" ? "selected" : ""}
                    onClick={() => setView("week")}
                  >
                    Week
                  </button>
                </div>
              </div>
            </div>
            <CalendarGrid
              date={currentDate}
              view={view}
              events={filteredEvents}
              onSelectDate={openCreate}
              onSelectEvent={openEdit}
            />
            <div className="calendar-footer">
              <div className="legend">
                {eventTypes.map((type) => (
                  <span key={type}>
                    <i className={`legend-dot category-${typeClass(type)}`} />
                    {type}
                  </span>
                ))}
              </div>
              <span className="footer-hint">
                Double-click a day to add an event
              </span>
            </div>
          </div>
          <div className="upcoming-section">
            <div className="section-heading">
              <div>
                <h2>Coming up</h2>
              </div>
              <button
                className="text-button"
                onClick={() => {
                  setView("week");
                  setCurrentDate(new Date());
                }}
              >
                View this week <ChevronRightIcon sx={{ fontSize: 15 }} />
              </button>
            </div>
            <div className="upcoming-grid">
              {upcoming.length ? (
                upcoming.map((event) => (
                  <button
                    className="upcoming-card"
                    key={event.id}
                    onClick={() => openEdit(event)}
                  >
                    <div
                      className={`upcoming-date category-${typeClass(event.type)}`}
                    >
                      <span>
                        {format(
                          new Date(`${eventDate(event)}T12:00:00`),
                          "MMM",
                        )}
                      </span>
                      <strong>
                        {format(new Date(`${eventDate(event)}T12:00:00`), "dd")}
                      </strong>
                    </div>
                    <div className="upcoming-info">
                      <strong>{event.name}</strong>
                      <span>
                        <AccessTimeIcon sx={{ fontSize: 13 }} />
                        {format(
                          new Date(`${eventDate(event)}T12:00:00`),
                          "EEE",
                        )}{" "}
                        · {timeLabel(event.startDate)}
                      </span>
                    </div>
                    <span
                      className={`category-pill category-${typeClass(event.type)}`}
                    >
                      {event.type}
                    </span>
                  </button>
                ))
              ) : (
                <div className="empty-upcoming">
                  No upcoming events match your filters.
                </div>
              )}
            </div>
          </div>
          <footer className="app-footer">
            A calmer way to keep your days together <span>·</span> Made for
            focus
          </footer>
        </div>
      </section>
      <EventModal
        open={modalOpen}
        initialDate={draftDate}
        eventTypes={eventTypes.length ? eventTypes : ["meeting"]}
        event={editing}
        onClose={() => setModalOpen(false)}
        onSave={save}
        onDelete={
          editing
            ? () => {
                deleteEvent(editing.id);
                setModalOpen(false);
                setEditing(undefined);
              }
            : undefined
        }
      />
    </main>
  );
}

function MiniCalendar({
  date,
  events,
  onPick,
}: {
  date: Date;
  events: CalendarEvent[];
  onPick: (date: Date) => void;
}) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return (
    <div className="mini-calendar">
      <div className="mini-weekdays">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={`${d}${i}`}>{d}</span>
        ))}
      </div>
      <div className="mini-days">
        {Array.from({ length: 42 }, (_, i) => {
          const day = new Date(start);
          day.setDate(start.getDate() + i);
          const active = isSameDay(day, date);
          const marked = events.some((event) => eventDate(event) === iso(day));
          return (
            <button
              key={iso(day)}
              className={`${day.getMonth() !== date.getMonth() ? "muted" : ""} ${active ? "chosen" : ""} ${isToday(day) ? "is-today" : ""} ${marked ? "marked" : ""}`}
              onClick={() => onPick(day)}
              aria-label={format(day, "MMMM d, yyyy")}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
