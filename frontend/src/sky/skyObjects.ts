// A small, bundled catalog of well-known / large deep-sky objects, used by the
// named-object overlay to draw an extent circle + label on the sky view so the
// user can orient and spot framing targets at a glance (bead `cia`).
//
// This is deliberately a *curated highlights* list (Messier showpieces + famous
// NGC/IC nebulae and galaxies), not the full Messier/NGC catalogs: the goal is
// orientation, so a clutter-free set of the recognisable, mostly-large objects
// reads far better on a wide field than thousands of faint sources. It is
// bundled (no network/CORS dependency) and deterministic for tests.
//
// Coordinates are J2000 in DEGREES. `sizeArcmin` is the object's major angular
// axis in arcminutes; the overlay draws a circle of radius sizeArcmin/2.

export interface SkyObject {
  /** Primary catalog id, e.g. "M31", "NGC 7000". */
  id: string;
  /** Common name, e.g. "Andromeda Galaxy". Empty if the object has none. */
  name: string;
  /** Right ascension, J2000, degrees. */
  ra: number;
  /** Declination, J2000, degrees. */
  dec: number;
  /** Major angular axis, arcminutes (drives the circle radius). */
  sizeArcmin: number;
  /** Coarse object class, for the popup. */
  kind: "galaxy" | "nebula" | "cluster" | "planetary" | "supernova";
}

/** Label to render for an object: its common name if it has one, else its id. */
export function objectLabel(o: SkyObject): string {
  return o.name ? `${o.id} ${o.name}` : o.id;
}

export const NAMED_OBJECTS: SkyObject[] = [
  // --- Messier highlights ---
  { id: "M1", name: "Crab Nebula", ra: 83.63, dec: 22.01, sizeArcmin: 6, kind: "supernova" },
  { id: "M8", name: "Lagoon Nebula", ra: 270.92, dec: -24.38, sizeArcmin: 90, kind: "nebula" },
  { id: "M13", name: "Hercules Cluster", ra: 250.42, dec: 36.46, sizeArcmin: 20, kind: "cluster" },
  { id: "M16", name: "Eagle Nebula", ra: 274.7, dec: -13.79, sizeArcmin: 35, kind: "nebula" },
  { id: "M17", name: "Omega Nebula", ra: 275.2, dec: -16.17, sizeArcmin: 11, kind: "nebula" },
  { id: "M20", name: "Trifid Nebula", ra: 270.65, dec: -23.03, sizeArcmin: 28, kind: "nebula" },
  { id: "M27", name: "Dumbbell Nebula", ra: 299.9, dec: 22.72, sizeArcmin: 8, kind: "planetary" },
  { id: "M31", name: "Andromeda Galaxy", ra: 10.68, dec: 41.27, sizeArcmin: 178, kind: "galaxy" },
  { id: "M33", name: "Triangulum Galaxy", ra: 23.46, dec: 30.66, sizeArcmin: 70, kind: "galaxy" },
  { id: "M42", name: "Orion Nebula", ra: 83.82, dec: -5.39, sizeArcmin: 85, kind: "nebula" },
  { id: "M44", name: "Beehive Cluster", ra: 130.1, dec: 19.67, sizeArcmin: 95, kind: "cluster" },
  { id: "M45", name: "Pleiades", ra: 56.75, dec: 24.12, sizeArcmin: 110, kind: "cluster" },
  { id: "M51", name: "Whirlpool Galaxy", ra: 202.47, dec: 47.2, sizeArcmin: 11, kind: "galaxy" },
  { id: "M57", name: "Ring Nebula", ra: 283.4, dec: 33.03, sizeArcmin: 1.4, kind: "planetary" },
  { id: "M63", name: "Sunflower Galaxy", ra: 198.96, dec: 42.03, sizeArcmin: 12, kind: "galaxy" },
  { id: "M64", name: "Black Eye Galaxy", ra: 194.18, dec: 21.68, sizeArcmin: 10, kind: "galaxy" },
  { id: "M78", name: "", ra: 86.69, dec: 0.05, sizeArcmin: 8, kind: "nebula" },
  { id: "M81", name: "Bode's Galaxy", ra: 148.89, dec: 69.07, sizeArcmin: 27, kind: "galaxy" },
  { id: "M82", name: "Cigar Galaxy", ra: 148.97, dec: 69.68, sizeArcmin: 11, kind: "galaxy" },
  { id: "M97", name: "Owl Nebula", ra: 168.7, dec: 55.02, sizeArcmin: 3.4, kind: "planetary" },
  { id: "M101", name: "Pinwheel Galaxy", ra: 210.8, dec: 54.35, sizeArcmin: 29, kind: "galaxy" },
  { id: "M104", name: "Sombrero Galaxy", ra: 190.0, dec: -11.62, sizeArcmin: 9, kind: "galaxy" },
  { id: "M106", name: "", ra: 184.74, dec: 47.3, sizeArcmin: 18, kind: "galaxy" },

  // --- Famous NGC / IC objects ---
  { id: "NGC 7000", name: "North America Nebula", ra: 314.75, dec: 44.52, sizeArcmin: 120, kind: "nebula" },
  { id: "NGC 2237", name: "Rosette Nebula", ra: 97.92, dec: 5.05, sizeArcmin: 80, kind: "nebula" },
  { id: "NGC 6960", name: "Veil Nebula", ra: 312.75, dec: 30.7, sizeArcmin: 180, kind: "supernova" },
  { id: "NGC 7635", name: "Bubble Nebula", ra: 350.2, dec: 61.2, sizeArcmin: 15, kind: "nebula" },
  { id: "IC 1805", name: "Heart Nebula", ra: 38.2, dec: 61.45, sizeArcmin: 100, kind: "nebula" },
  { id: "IC 1848", name: "Soul Nebula", ra: 42.8, dec: 60.42, sizeArcmin: 100, kind: "nebula" },
  { id: "IC 1396", name: "Elephant's Trunk", ra: 324.7, dec: 57.5, sizeArcmin: 170, kind: "nebula" },
  { id: "NGC 869", name: "Double Cluster", ra: 35.0, dec: 57.13, sizeArcmin: 60, kind: "cluster" },
  { id: "NGC 891", name: "", ra: 35.64, dec: 42.35, sizeArcmin: 14, kind: "galaxy" },
  { id: "NGC 253", name: "Sculptor Galaxy", ra: 11.9, dec: -25.29, sizeArcmin: 27, kind: "galaxy" },
  { id: "NGC 7293", name: "Helix Nebula", ra: 337.41, dec: -20.84, sizeArcmin: 16, kind: "planetary" },
  { id: "NGC 5128", name: "Centaurus A", ra: 201.36, dec: -43.02, sizeArcmin: 26, kind: "galaxy" },
  { id: "NGC 4565", name: "Needle Galaxy", ra: 189.09, dec: 25.99, sizeArcmin: 16, kind: "galaxy" },
  { id: "NGC 6888", name: "Crescent Nebula", ra: 303.0, dec: 38.35, sizeArcmin: 18, kind: "nebula" },
  { id: "NGC 2024", name: "Flame Nebula", ra: 85.43, dec: -1.85, sizeArcmin: 30, kind: "nebula" },
  { id: "IC 434", name: "Horsehead Nebula", ra: 85.24, dec: -2.46, sizeArcmin: 8, kind: "nebula" },
  { id: "NGC 7380", name: "Wizard Nebula", ra: 341.75, dec: 58.13, sizeArcmin: 25, kind: "nebula" },
  { id: "NGC 281", name: "Pacman Nebula", ra: 13.2, dec: 56.62, sizeArcmin: 35, kind: "nebula" },
];
