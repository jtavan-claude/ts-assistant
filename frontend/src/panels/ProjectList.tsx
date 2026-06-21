import type { ReactNode } from "react";
import type { ExposurePlan, Project, Target } from "../api";

interface Props {
  projects: Project[];
  selectedTargetId: number | null;
  onSelectTarget: (t: Target) => void;
  /** Load a Draft, no-progress project into the builder for editing (o2c). */
  onEditProject: (p: Project) => void;
  /** Toggle one exposure plan's enabled flag, persisted via the backend (ipq). */
  onTogglePlanEnabled: (planId: number, enabled: boolean) => void;
  /** The project builder (New-project button / draft form), shown at the top. */
  builder: ReactNode;
}

/** A project is safely editable when it's a Draft with no captured frames. The
 * backend re-checks (and also refuses custom cadence/order); this is the UI gate. */
function isEditable(p: Project): boolean {
  return (
    p.state === "draft" &&
    p.targets.every((t) => t.exposure_plans.every((pl) => pl.acquired === 0))
  );
}

/** Roll exposure plans up into acquisition totals. `pending` is frames still
 * needed to reach the goal by the real "done" count (accepted = passed grading);
 * `pendingGrading` is captured-but-ungraded frames (could still become accepted). */
function planTotals(plans: ExposurePlan[]) {
  let desired = 0;
  let acquired = 0;
  let accepted = 0;
  let pendingGrading = 0;
  for (const p of plans) {
    desired += p.desired;
    acquired += p.acquired;
    accepted += p.accepted;
    pendingGrading += p.pending_grading ?? 0;
  }
  return {
    desired,
    acquired,
    accepted,
    pendingGrading,
    pending: Math.max(0, desired - accepted),
  };
}

/** Compact completion badge, green once the goal is met. Shows "accepted/desired",
 * or "accepted (pending)/desired" when frames are captured but not yet graded — e.g.
 * "0 (45)/60" — so a not-yet-graded run doesn't look like no progress at all.
 * Hover shows the fuller desired/acquired/accepted/captured-ungraded/pending breakdown. */
function Completion({ plans, className }: { plans: ExposurePlan[]; className: string }) {
  const t = planTotals(plans);
  if (!t.desired) return null;
  const done = t.pending === 0;
  return (
    <span
      className={className + (done ? " complete" : "")}
      title={
        `desired ${t.desired} · acquired ${t.acquired} · accepted ${t.accepted}` +
        ` · ${t.pendingGrading} awaiting grading · ${t.pending} to go`
      }
    >
      {t.accepted}
      {t.pendingGrading > 0 && (
        <span className="prog-pending"> ({t.pendingGrading})</span>
      )}
      /{t.desired}
    </span>
  );
}

/** Per-filter exposure-plan rows under a target, each with an enabled/disabled
 * toggle (ts_assistant-ipq). Toggling persists via the backend; clicks don't bubble
 * to the row's target-select handler. */
function PlanRows({
  plans,
  onTogglePlanEnabled,
}: {
  plans: ExposurePlan[];
  onTogglePlanEnabled: (planId: number, enabled: boolean) => void;
}) {
  if (!plans.length) return null;
  return (
    <ul className="plan-rows" onClick={(e) => e.stopPropagation()}>
      {plans.map((pl) => (
        <li
          key={pl.id}
          className={"plan-row-item" + (pl.enabled ? "" : " disabled")}
        >
          <label className="plan-enable" title="Enable/disable this filter for the scheduler">
            <input
              type="checkbox"
              checked={pl.enabled}
              onChange={(e) => onTogglePlanEnabled(pl.id, e.target.checked)}
            />
            <span className="plan-filter">{pl.filter_name ?? "—"}</span>
          </label>
          {pl.exposure != null && (
            <span className="plan-exp">{pl.exposure}s</span>
          )}
          <Completion plans={[pl]} className="plan-prog" />
        </li>
      ))}
    </ul>
  );
}

export default function ProjectList({
  projects,
  selectedTargetId,
  onSelectTarget,
  onEditProject,
  onTogglePlanEnabled,
  builder,
}: Props) {
  // Sort a copy alphabetically by name (case-insensitive). `.sort` is stable
  // in modern engines, so equal-named projects keep their original order.
  const sortedProjects = [...projects].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
  return (
    <details className="projects-panel" open>
      <summary>
        <span className="eq-title">Projects</span>
        {projects.length > 0 && <span className="count">{projects.length}</span>}
      </summary>

      {builder}

      {!projects.length ? (
        <div className="panel-empty">
          No projects loaded. Drop a <code>schedulerdb.sqlite</code> into
          <code> sample_database/</code> and refresh.
        </div>
      ) : (
        <div className="project-list">
          {sortedProjects.map((p) => (
            // Start collapsed (5co): per-filter rows make each project tall, so an
            // all-expanded list is too long to scan — expand only what you open.
            <details key={p.id} className="project">
              <summary>
                <span className="project-name">{p.name}</span>
                <span className={`badge state-${p.state}`}>{p.state}</span>
                {p.is_mosaic && <span className="badge mosaic">mosaic</span>}
                <Completion
                  plans={p.targets.flatMap((t) => t.exposure_plans)}
                  className="proj-prog"
                />
                <span className="count">{p.targets.length}</span>
                {isEditable(p) && (
                  <button
                    className="proj-edit"
                    title="Edit this Draft project"
                    onClick={(e) => {
                      e.preventDefault(); // don't toggle the <details>
                      onEditProject(p);
                    }}
                  >
                    ✎
                  </button>
                )}
              </summary>
              <ul>
                {p.targets.map((t) => (
                  <li
                    key={t.id}
                    className={
                      "target" + (t.id === selectedTargetId ? " selected" : "")
                    }
                    onClick={() => onSelectTarget(t)}
                  >
                    <span className={"dot" + (t.active ? " active" : "")} />
                    <span className="target-name">{t.name}</span>
                    <Completion plans={t.exposure_plans} className="target-prog" />
                    <span className="coords">
                      {t.ra_deg.toFixed(2)}°, {t.dec_deg.toFixed(2)}°
                    </span>
                    <PlanRows
                      plans={t.exposure_plans}
                      onTogglePlanEnabled={onTogglePlanEnabled}
                    />
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      )}
    </details>
  );
}
