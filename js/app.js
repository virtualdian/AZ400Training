/* Thuis Kracht — app-logica (geen dependencies, alles lokaal in de browser) */
(function () {
  "use strict";

  // ---------- Opslag ----------
  const opslag = {
    lees(sleutel, standaard) {
      try {
        const ruw = localStorage.getItem(sleutel);
        return ruw ? JSON.parse(ruw) : standaard;
      } catch (e) {
        return standaard;
      }
    },
    schrijf(sleutel, waarde) {
      localStorage.setItem(sleutel, JSON.stringify(waarde));
    },
  };

  let instellingen = opslag.lees("fitapp.instellingen", {
    stangKg: STANDAARD_STANG_KG,
    schijven: STANDAARD_SCHIJVEN,
  });
  let logboek = opslag.lees("fitapp.logboek", []); // [{id, datum, naam, entries:[{oefId, sets:[{kg, reps}]}]}]
  let actieveWorkout = opslag.lees("fitapp.actief", null);

  const bewaarAlles = () => {
    opslag.schrijf("fitapp.instellingen", instellingen);
    opslag.schrijf("fitapp.logboek", logboek);
    opslag.schrijf("fitapp.actief", actieveWorkout);
  };

  // ---------- Hulpjes ----------
  const $ = (sel, el) => (el || document).querySelector(sel);
  const oefening = (id) => OEFENINGEN.find((o) => o.id === id);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtKg = (kg) => (Math.round(kg * 10) / 10).toString().replace(".", ",");
  const fmtDatum = (iso) =>
    new Date(iso).toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
  const e1rm = (kg, reps) => (reps <= 1 ? kg : kg * (1 + reps / 30)); // Epley

  function laatsteGewicht(oefId) {
    for (let i = logboek.length - 1; i >= 0; i--) {
      const entry = logboek[i].entries.find((e) => e.oefId === oefId && e.sets.length);
      if (entry) return entry.sets[entry.sets.length - 1].kg;
    }
    return null;
  }

  // ---------- Schijvencalculator ----------
  // Zoekt de beste exacte belading per kant met de beschikbare schijven (dynamisch programmeren op halve kilo's).
  function berekenBelading(doelTotaalKg) {
    const perKant = (doelTotaalKg - instellingen.stangKg) / 2;
    if (perKant < 0) return { haalbaar: false, reden: "lichter dan de stang" };
    const schijven = instellingen.schijven
      .map((s) => ({ kg: Number(s.kg), max: Math.floor(Number(s.aantal) / 2) }))
      .filter((s) => s.kg > 0 && s.max > 0)
      .sort((a, b) => b.kg - a.kg);

    const doelHalf = Math.round(perKant * 2); // in halve kilo's
    const maxHalf = schijven.reduce((som, s) => som + s.kg * 2 * s.max, 0);
    const limiet = Math.min(doelHalf, maxHalf);

    // Bounded knapsack: per schijfsoort alle haalbare beladingen per kant opbouwen
    const combi = new Array(maxHalf + 1).fill(null);
    combi[0] = [];
    for (const s of schijven) {
      const stap = Math.round(s.kg * 2);
      for (let h = maxHalf; h >= 0; h--) {
        if (combi[h] === null) continue;
        for (let n = 1; n <= s.max; n++) {
          const nieuw = h + stap * n;
          if (nieuw > maxHalf) break;
          if (combi[nieuw] === null) combi[nieuw] = combi[h].concat(Array(n).fill(s.kg));
        }
      }
    }
    // Zoek dichtstbijzijnde haalbare belading (eerst exact, anders eronder, anders erboven)
    let besteH = -1;
    for (let afstand = 0; afstand <= maxHalf; afstand++) {
      if (limiet - afstand >= 0 && combi[limiet - afstand]) { besteH = limiet - afstand; break; }
      if (limiet + afstand <= maxHalf && combi[limiet + afstand]) { besteH = limiet + afstand; break; }
    }
    if (besteH < 0) return { haalbaar: false, reden: "geen combinatie mogelijk" };
    const kant = combi[besteH].sort((a, b) => b - a);
    const totaal = instellingen.stangKg + besteH;
    return {
      haalbaar: true,
      exact: doelHalf === besteH,
      perKant: kant,
      totaal,
    };
  }

  // ---------- Grafiek (inline SVG, één serie) ----------
  function bouwGrafiek(punten) {
    // punten: [{datum, kg, reps, e1rm}] gesorteerd op datum
    const B = 340, H = 190, padL = 40, padR = 14, padT = 16, padB = 28;
    const xs = punten.map((_, i) => (punten.length === 1 ? 0.5 : i / (punten.length - 1)));
    const waarden = punten.map((p) => p.e1rm);
    const maxW = Math.max(...waarden), minW = Math.min(...waarden);
    const span = maxW - minW || Math.max(maxW * 0.1, 2);
    const yTop = maxW + span * 0.15, yBot = Math.max(0, minW - span * 0.15);
    const x = (t) => padL + t * (B - padL - padR);
    const y = (w) => padT + (1 - (w - yBot) / (yTop - yBot)) * (H - padT - padB);

    // rasterlijnen (3 stuks); bij een klein bereik 1 decimaal zodat labels niet dubbel worden
    const stappen = 3;
    const decimalen = yTop - yBot < 4 ? 1 : 0;
    let raster = "";
    for (let i = 0; i <= stappen; i++) {
      const w = yBot + ((yTop - yBot) * i) / stappen;
      const yy = y(w);
      raster += `<line x1="${padL}" y1="${yy}" x2="${B - padR}" y2="${yy}" stroke="var(--border)" stroke-width="1"/>` +
        `<text x="${padL - 6}" y="${yy + 3.5}" text-anchor="end" font-size="10" fill="var(--text-muted)">${w.toFixed(decimalen).replace(".", ",")}</text>`;
    }

    const pad = punten.map((p, i) => `${i ? "L" : "M"}${x(xs[i]).toFixed(1)},${y(p.e1rm).toFixed(1)}`).join(" ");
    const prIndex = waarden.indexOf(maxW);

    let markers = "";
    punten.forEach((p, i) => {
      const cx = x(xs[i]), cy = y(p.e1rm);
      const isPr = i === prIndex, isLaatste = i === punten.length - 1;
      markers += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="4" fill="var(--accent)" stroke="var(--surface-1)" stroke-width="2"
        data-i="${i}" style="cursor:pointer"/>`;
      if (isPr || (isLaatste && i !== prIndex)) {
        markers += `<text x="${cx.toFixed(1)}" y="${(cy - 9).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="700"
          fill="var(--text-secondary)">${Math.round(p.e1rm)}${isPr ? " ★" : ""}</text>`;
      }
      // onzichtbaar groter tikdoel
      markers += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="14" fill="transparent" data-i="${i}" class="tikdoel"/>`;
    });

    const eerste = fmtDatum(punten[0].datum);
    const laatste = fmtDatum(punten[punten.length - 1].datum);
    const xLabels =
      `<text x="${padL}" y="${H - 8}" font-size="10" fill="var(--text-muted)">${eerste}</text>` +
      (punten.length > 1
        ? `<text x="${B - padR}" y="${H - 8}" text-anchor="end" font-size="10" fill="var(--text-muted)">${laatste}</text>`
        : "");

    return `<svg viewBox="0 0 ${B} ${H}" role="img" aria-label="Geschat 1RM verloop">
      ${raster}
      <path d="${pad}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      ${markers}
      ${xLabels}
    </svg>`;
  }

  // ---------- Modals ----------
  function toonModal(html) {
    sluitModal();
    const achtergrond = document.createElement("div");
    achtergrond.className = "modal-achtergrond";
    achtergrond.innerHTML = `<div class="modal"><div class="greep"></div>${html}</div>`;
    achtergrond.addEventListener("click", (e) => { if (e.target === achtergrond) sluitModal(); });
    document.body.appendChild(achtergrond);
    return achtergrond;
  }
  function sluitModal() {
    const m = $(".modal-achtergrond");
    if (m) m.remove();
  }

  function toonOefening(id, kanToevoegen) {
    const o = oefening(id);
    if (!o) return;
    const modal = toonModal(`
      <h2>${esc(o.naam)}</h2>
      <div class="en-naam">${esc(o.en)}</div>
      <div>
        <span class="badge accent">${esc(o.doelspier)}</span>
        ${o.secundair.map((s) => `<span class="badge">${esc(s)}</span>`).join("")}
      </div>
      <div class="meta" style="margin:10px 0 4px;color:var(--text-muted);font-size:0.82rem">
        Nodig: ${o.materiaal.map((m) => MATERIAAL[m]).join(" · ")}
      </div>
      <h3 style="font-size:0.9rem;margin:14px 0 6px">Uitvoering</h3>
      <ol>${o.instructies.map((i) => `<li>${esc(i)}</li>`).join("")}</ol>
      ${o.tip ? `<div class="tip-blok"><strong>Tip:</strong> ${esc(o.tip)}</div>` : ""}
      ${kanToevoegen ? `<button class="knop" data-actie="toevoegen">+ Toevoegen aan training</button>` : ""}
    `);
    if (kanToevoegen) {
      $("[data-actie=toevoegen]", modal).addEventListener("click", () => {
        voegOefeningToeAanWorkout(id);
        sluitModal();
        gaNaarTab("training");
      });
    }
  }

  // ---------- Workout-beheer ----------
  function startWorkout(schema) {
    actieveWorkout = {
      naam: schema ? schema.naam : "Vrije training",
      gestart: new Date().toISOString(),
      entries: schema
        ? schema.oefeningen.map((so) => ({
            oefId: so.ref,
            doel: `${so.sets} × ${so.reps}`,
            sets: [],
          }))
        : [],
    };
    bewaarAlles();
    gaNaarTab("training");
  }

  function voegOefeningToeAanWorkout(oefId) {
    if (!actieveWorkout) {
      actieveWorkout = { naam: "Vrije training", gestart: new Date().toISOString(), entries: [] };
    }
    if (!actieveWorkout.entries.some((e) => e.oefId === oefId)) {
      actieveWorkout.entries.push({ oefId, doel: null, sets: [] });
    }
    bewaarAlles();
  }

  function rondWorkoutAf() {
    const metSets = actieveWorkout.entries.filter((e) => e.sets.length);
    if (metSets.length) {
      logboek.push({
        id: Date.now().toString(36),
        datum: actieveWorkout.gestart,
        naam: actieveWorkout.naam,
        entries: metSets,
      });
    }
    actieveWorkout = null;
    bewaarAlles();
    render();
  }

  // ---------- Tabs ----------
  let huidigeTab = "oefeningen";
  let oefFilter = { zoek: "", groep: "Alle", materiaal: "alle" };
  let progressieKeuze = null;

  function gaNaarTab(tab) {
    huidigeTab = tab;
    render();
    window.scrollTo(0, 0);
  }

  // ---------- Weergave: Oefeningen ----------
  function renderOefeningen(el) {
    const groepen = ["Alle"].concat(GROEPEN);
    const zichtbaar = OEFENINGEN.filter((o) => {
      const z = oefFilter.zoek.toLowerCase();
      if (z && !(o.naam.toLowerCase().includes(z) || o.en.toLowerCase().includes(z) || o.doelspier.toLowerCase().includes(z))) return false;
      if (oefFilter.groep !== "Alle" && o.groep !== oefFilter.groep) return false;
      if (oefFilter.materiaal !== "alle" && !o.materiaal.includes(oefFilter.materiaal)) return false;
      return true;
    });

    el.innerHTML = `
      <input class="zoekveld" type="search" placeholder="Zoek een oefening…" value="${esc(oefFilter.zoek)}" id="zoek">
      <div class="chips" id="groep-chips">
        ${groepen.map((g) => `<button class="chip ${oefFilter.groep === g ? "actief" : ""}" data-groep="${esc(g)}">${esc(g)}</button>`).join("")}
      </div>
      <div class="chips" id="mat-chips">
        <button class="chip ${oefFilter.materiaal === "alle" ? "actief" : ""}" data-mat="alle">Al het materiaal</button>
        ${Object.entries(MATERIAAL).map(([k, v]) => `<button class="chip ${oefFilter.materiaal === k ? "actief" : ""}" data-mat="${k}">${esc(v)}</button>`).join("")}
      </div>
      <div class="sectie-titel">${zichtbaar.length} oefeningen</div>
      ${zichtbaar
        .map(
          (o) => `
        <div class="kaart klikbaar" data-oef="${o.id}">
          <h3>${esc(o.naam)}</h3>
          <div class="sub">${esc(o.doelspier)}</div>
          <div>${o.materiaal.map((m) => `<span class="badge">${esc(MATERIAAL[m])}</span>`).join("")}</div>
        </div>`
        )
        .join("")}
      ${zichtbaar.length === 0 ? `<div class="leeg-melding"><span class="emoji">🔍</span>Geen oefeningen gevonden met deze filters.</div>` : ""}
    `;

    $("#zoek", el).addEventListener("input", (e) => {
      oefFilter.zoek = e.target.value;
      renderOefeningen(el);
      const veld = $("#zoek", el);
      veld.focus();
      veld.setSelectionRange(veld.value.length, veld.value.length);
    });
    $("#groep-chips", el).addEventListener("click", (e) => {
      const b = e.target.closest("[data-groep]");
      if (b) { oefFilter.groep = b.dataset.groep; renderOefeningen(el); }
    });
    $("#mat-chips", el).addEventListener("click", (e) => {
      const b = e.target.closest("[data-mat]");
      if (b) { oefFilter.materiaal = b.dataset.mat; renderOefeningen(el); }
    });
    el.addEventListener("click", (e) => {
      const kaart = e.target.closest("[data-oef]");
      if (kaart) toonOefening(kaart.dataset.oef, true);
    });
  }

  // ---------- Weergave: Schema's ----------
  function renderSchemas(el) {
    el.innerHTML = `
      <div class="sectie-titel">Krachtschema's voor jouw thuisgym</div>
      ${SCHEMAS.map(
        (s) => `
        <div class="kaart klikbaar" data-schema="${s.id}">
          <h3>${esc(s.naam)}</h3>
          <div class="sub">${esc(s.focus)}</div>
          <div class="meta">${s.oefeningen.length} oefeningen · ${esc(s.duur)}</div>
        </div>`
      ).join("")}
    `;
    el.addEventListener("click", (e) => {
      const kaart = e.target.closest("[data-schema]");
      if (kaart) toonSchema(kaart.dataset.schema);
    });
  }

  function toonSchema(id) {
    const s = SCHEMAS.find((x) => x.id === id);
    const modal = toonModal(`
      <h2>${esc(s.naam)}</h2>
      <div class="sub" style="color:var(--text-secondary)">${esc(s.focus)} · ${esc(s.duur)}</div>
      <p style="color:var(--text-secondary);font-size:0.9rem">${esc(s.beschrijving)}</p>
      <div class="tip-blok"><strong>Rust:</strong> ${esc(s.rust)}</div>
      <div class="sectie-titel">Oefeningen</div>
      ${s.oefeningen
        .map((so) => {
          const o = oefening(so.ref);
          return `
          <div class="kaart klikbaar" data-oef="${so.ref}" style="margin-bottom:8px">
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
              <h3 style="font-size:0.95rem">${esc(o.naam)}</h3>
              <span class="doel-label">${so.sets} × ${esc(String(so.reps))}</span>
            </div>
            ${so.notitie ? `<div class="meta">${esc(so.notitie)}</div>` : ""}
          </div>`;
        })
        .join("")}
      <button class="knop" data-actie="start">▶ Start deze workout</button>
    `);
    modal.addEventListener("click", (e) => {
      const kaart = e.target.closest("[data-oef]");
      if (kaart) { toonOefening(kaart.dataset.oef, false); return; }
      if (e.target.closest("[data-actie=start]")) {
        if (actieveWorkout && actieveWorkout.entries.some((x) => x.sets.length)) {
          if (!confirm("Er loopt nog een training. Vervangen?")) return;
        }
        sluitModal();
        startWorkout(s);
      }
    });
  }

  // ---------- Weergave: Training ----------
  function renderTraining(el) {
    let html = "";

    // Schijvencalculator
    html += `
      <div class="kaart">
        <h3>🏋️ Schijvencalculator</h3>
        <div class="sub">Hoeveel schijven per kant voor een doelgewicht? (stang: ${fmtKg(instellingen.stangKg)} kg)</div>
        <div class="set-invoer">
          <input type="number" inputmode="decimal" id="calc-doel" placeholder="bijv. 60" min="0" step="0.5">
          <span class="eenheid">kg totaal</span>
          <button class="knop-klein accent" id="calc-knop">Bereken</button>
        </div>
        <div id="calc-uit"></div>
      </div>
    `;

    if (actieveWorkout) {
      html += `
        <div class="sectie-titel">Actieve training</div>
        <div class="kaart">
          <h3>${esc(actieveWorkout.naam)}</h3>
          <div class="meta">Gestart: ${fmtDatum(actieveWorkout.gestart)}</div>
        </div>
        ${actieveWorkout.entries
          .map((entry, ei) => {
            const o = oefening(entry.oefId);
            const vorige = laatsteGewicht(entry.oefId);
            return `
          <div class="kaart">
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
              <h3 class="klikbaar" data-oef="${entry.oefId}" style="cursor:pointer">${esc(o.naam)}</h3>
              ${entry.doel ? `<span class="doel-label">doel ${esc(entry.doel)}</span>` : ""}
            </div>
            ${vorige !== null && !entry.sets.length ? `<div class="meta">Vorige keer: ${fmtKg(vorige)} kg</div>` : ""}
            ${entry.sets
              .map(
                (s, si) => `
              <div class="set-rij">
                <span class="setnr">Set ${si + 1}</span>
                <span class="waarde"><strong>${fmtKg(s.kg)} kg</strong> × ${s.reps}</span>
                <button class="verwijder" data-verwijder-set="${ei}:${si}" aria-label="Verwijder set">✕</button>
              </div>`
              )
              .join("")}
            <div class="set-invoer">
              <input type="number" inputmode="decimal" placeholder="kg" step="0.5" min="0" id="kg-${ei}" value="${entry.sets.length ? entry.sets[entry.sets.length - 1].kg : vorige !== null ? vorige : ""}">
              <input type="number" inputmode="numeric" placeholder="reps" min="1" id="reps-${ei}" value="${entry.sets.length ? entry.sets[entry.sets.length - 1].reps : ""}">
              <button class="knop-klein accent" data-log-set="${ei}">+ Set</button>
            </div>
          </div>`;
          })
          .join("")}
        <button class="knop secundair" id="oefening-toevoegen">+ Oefening toevoegen</button>
        <button class="knop" id="afronden">✓ Training afronden</button>
        <button class="knop gevaar" id="annuleren">Training annuleren</button>
      `;
    } else {
      html += `
        <div class="sectie-titel">Nieuwe training</div>
        <button class="knop" id="start-leeg">+ Start vrije training</button>
        <div class="sectie-titel">Of start een schema</div>
        ${SCHEMAS.map(
          (s) => `
          <div class="kaart klikbaar" data-start-schema="${s.id}">
            <h3>${esc(s.naam)}</h3>
            <div class="meta">${s.oefeningen.length} oefeningen · ${esc(s.duur)}</div>
          </div>`
        ).join("")}
      `;
    }

    // Historie
    const historie = logboek.slice().reverse();
    html += `<div class="sectie-titel">Geschiedenis (${historie.length})</div>`;
    if (!historie.length) {
      html += `<div class="leeg-melding"><span class="emoji">📒</span>Nog geen trainingen gelogd. Je eerste workout verschijnt hier.</div>`;
    } else {
      html += historie
        .map((w) => {
          const sets = w.entries.reduce((n, e) => n + e.sets.length, 0);
          const volume = w.entries.reduce((v, e) => v + e.sets.reduce((x, s) => x + s.kg * s.reps, 0), 0);
          return `
          <div class="kaart klikbaar" data-workout="${w.id}">
            <div style="display:flex;justify-content:space-between;align-items:baseline">
              <h3 style="font-size:0.95rem">${esc(w.naam)}</h3>
              <span class="meta">${fmtDatum(w.datum)}</span>
            </div>
            <div class="meta">${w.entries.length} oefeningen · ${sets} sets · ${fmtKg(volume)} kg totaal volume</div>
          </div>`;
        })
        .join("");
    }

    el.innerHTML = html;

    // Calculator
    const rekenUit = () => {
      const doel = parseFloat($("#calc-doel", el).value.replace(",", "."));
      const uit = $("#calc-uit", el);
      if (!doel || doel <= 0) { uit.innerHTML = ""; return; }
      const r = berekenBelading(doel);
      if (!r.haalbaar) {
        uit.innerHTML = `<div class="meta" style="margin-top:8px">Niet haalbaar (${esc(r.reden)}).</div>`;
        return;
      }
      uit.innerHTML = `
        <div class="calc-resultaat">
          ${r.perKant.length ? r.perKant.map((kg) => `<span class="schijf ${kg >= 10 ? "groot" : ""}">${fmtKg(kg)}</span>`).join("") : `<span class="meta">alleen de stang</span>`}
          <span class="meta" style="margin-left:4px">per kant</span>
        </div>
        <div class="meta" style="margin-top:6px">
          ${r.exact ? "Exact" : "Dichtstbijzijnde"}: <strong style="color:var(--text-primary)">${fmtKg(r.totaal)} kg totaal</strong>
          (stang ${fmtKg(instellingen.stangKg)} + 2 × ${fmtKg((r.totaal - instellingen.stangKg) / 2)})
        </div>`;
    };
    $("#calc-knop", el).addEventListener("click", rekenUit);
    $("#calc-doel", el).addEventListener("keydown", (e) => { if (e.key === "Enter") rekenUit(); });

    if (actieveWorkout) {
      el.addEventListener("click", (e) => {
        const logKnop = e.target.closest("[data-log-set]");
        if (logKnop) {
          const ei = Number(logKnop.dataset.logSet);
          const kg = parseFloat($(`#kg-${ei}`, el).value.replace(",", "."));
          const reps = parseInt($(`#reps-${ei}`, el).value, 10);
          if (isNaN(kg) || kg < 0 || !reps || reps < 1) return;
          actieveWorkout.entries[ei].sets.push({ kg, reps });
          bewaarAlles();
          render();
          return;
        }
        const verwijderKnop = e.target.closest("[data-verwijder-set]");
        if (verwijderKnop) {
          const [ei, si] = verwijderKnop.dataset.verwijderSet.split(":").map(Number);
          actieveWorkout.entries[ei].sets.splice(si, 1);
          bewaarAlles();
          render();
          return;
        }
        const naam = e.target.closest("[data-oef]");
        if (naam) { toonOefening(naam.dataset.oef, false); return; }
      });
      $("#oefening-toevoegen", el).addEventListener("click", toonOefeningKiezer);
      $("#afronden", el).addEventListener("click", () => {
        const sets = actieveWorkout.entries.reduce((n, x) => n + x.sets.length, 0);
        if (sets === 0) {
          if (!confirm("Je hebt nog geen sets gelogd. Training zonder opslaan sluiten?")) return;
        }
        rondWorkoutAf();
      });
      $("#annuleren", el).addEventListener("click", () => {
        if (confirm("Training annuleren? Gelogde sets gaan verloren.")) {
          actieveWorkout = null;
          bewaarAlles();
          render();
        }
      });
    } else {
      $("#start-leeg", el).addEventListener("click", () => startWorkout(null));
      el.addEventListener("click", (e) => {
        const s = e.target.closest("[data-start-schema]");
        if (s) { startWorkout(SCHEMAS.find((x) => x.id === s.dataset.startSchema)); return; }
        const w = e.target.closest("[data-workout]");
        if (w) toonWorkoutDetail(w.dataset.workout);
      });
    }
    if (actieveWorkout) {
      // historie-kaarten ook klikbaar tijdens actieve workout
      el.addEventListener("click", (e) => {
        const w = e.target.closest("[data-workout]");
        if (w) toonWorkoutDetail(w.dataset.workout);
      });
    }
  }

  function toonOefeningKiezer() {
    const modal = toonModal(`
      <h2>Kies een oefening</h2>
      <input class="zoekveld" type="search" placeholder="Zoek…" id="kiezer-zoek">
      <div id="kiezer-lijst"></div>
    `);
    const lijst = $("#kiezer-lijst", modal);
    const toon = (zoek) => {
      const z = (zoek || "").toLowerCase();
      lijst.innerHTML = OEFENINGEN.filter((o) => !z || o.naam.toLowerCase().includes(z) || o.doelspier.toLowerCase().includes(z))
        .map((o) => `<div class="kaart klikbaar" data-kies="${o.id}"><h3 style="font-size:0.92rem">${esc(o.naam)}</h3><div class="meta">${esc(o.groep)} · ${esc(o.doelspier)}</div></div>`)
        .join("");
    };
    toon("");
    $("#kiezer-zoek", modal).addEventListener("input", (e) => toon(e.target.value));
    lijst.addEventListener("click", (e) => {
      const k = e.target.closest("[data-kies]");
      if (k) { voegOefeningToeAanWorkout(k.dataset.kies); sluitModal(); render(); }
    });
  }

  function toonWorkoutDetail(id) {
    const w = logboek.find((x) => x.id === id);
    if (!w) return;
    const modal = toonModal(`
      <h2>${esc(w.naam)}</h2>
      <div class="sub" style="color:var(--text-muted)">${fmtDatum(w.datum)}</div>
      ${w.entries
        .map((e) => {
          const o = oefening(e.oefId);
          return `
        <div class="kaart" style="margin-top:10px">
          <h3 style="font-size:0.92rem">${o ? esc(o.naam) : e.oefId}</h3>
          ${e.sets.map((s, i) => `<div class="set-rij"><span class="setnr">Set ${i + 1}</span><span class="waarde">${fmtKg(s.kg)} kg × ${s.reps}</span></div>`).join("")}
        </div>`;
        })
        .join("")}
      <button class="knop gevaar" data-actie="verwijder">Verwijder deze training</button>
    `);
    $("[data-actie=verwijder]", modal).addEventListener("click", () => {
      if (confirm("Deze training definitief verwijderen?")) {
        logboek = logboek.filter((x) => x.id !== id);
        bewaarAlles();
        sluitModal();
        render();
      }
    });
  }

  // ---------- Weergave: Progressie ----------
  function renderProgressie(el) {
    const nu = new Date();
    const startWeek = new Date(nu);
    startWeek.setDate(nu.getDate() - ((nu.getDay() + 6) % 7)); // maandag
    startWeek.setHours(0, 0, 0, 0);
    const dezeWeek = logboek.filter((w) => new Date(w.datum) >= startWeek).length;
    const totaalVolume = logboek.reduce(
      (v, w) => v + w.entries.reduce((x, e) => x + e.sets.reduce((y, s) => y + s.kg * s.reps, 0), 0),
      0
    );

    // Per oefening: beste set (hoogste e1RM) per workout
    const perOefening = {};
    logboek.forEach((w) => {
      w.entries.forEach((e) => {
        if (!e.sets.length) return;
        let beste = null;
        e.sets.forEach((s) => {
          const waarde = e1rm(s.kg, s.reps);
          if (!beste || waarde > beste.e1rm) beste = { datum: w.datum, kg: s.kg, reps: s.reps, e1rm: waarde };
        });
        (perOefening[e.oefId] = perOefening[e.oefId] || []).push(beste);
      });
    });
    const gelogdeIds = Object.keys(perOefening).sort((a, b) => {
      const oa = oefening(a), ob = oefening(b);
      return (oa ? oa.naam : a).localeCompare(ob ? ob.naam : b);
    });

    if (!progressieKeuze || !perOefening[progressieKeuze]) progressieKeuze = gelogdeIds[0] || null;

    let grafiekHtml = "";
    if (progressieKeuze) {
      const o = oefening(progressieKeuze);
      const punten = perOefening[progressieKeuze].slice().sort((a, b) => new Date(a.datum) - new Date(b.datum));
      const pr = punten.reduce((m, p) => (p.kg > m ? p.kg : m), 0);
      grafiekHtml = `
        <div class="sectie-titel">Progressie per oefening</div>
        <select class="zoekveld" id="prog-select">
          ${gelogdeIds.map((id) => {
            const oo = oefening(id);
            return `<option value="${id}" ${id === progressieKeuze ? "selected" : ""}>${esc(oo ? oo.naam : id)}</option>`;
          }).join("")}
        </select>
        <div class="grafiek-kaart" style="position:relative" id="grafiek-wrap">
          <h3>${esc(o ? o.naam : "")} — geschat 1RM (kg)</h3>
          <div class="sub">Beste set per training, geschat via de Epley-formule · ★ = record · zwaarste gewicht ooit: ${fmtKg(pr)} kg</div>
          ${bouwGrafiek(punten)}
        </div>
        <table class="log-tabel">
          <thead><tr><th>Datum</th><th>Beste set</th><th>Geschat 1RM</th></tr></thead>
          <tbody>
            ${punten
              .slice()
              .reverse()
              .map((p) => {
                const isPr = Math.abs(p.e1rm - Math.max(...punten.map((x) => x.e1rm))) < 0.001;
                return `<tr><td>${fmtDatum(p.datum)}</td><td>${fmtKg(p.kg)} kg × ${p.reps}</td><td class="${isPr ? "pr" : ""}">${Math.round(p.e1rm)} kg${isPr ? " ★" : ""}</td></tr>`;
              })
              .join("")}
          </tbody>
        </table>
      `;
    }

    el.innerHTML = `
      <div class="stat-tegels">
        <div class="stat-tegel"><div class="waarde">${logboek.length}</div><div class="label">trainingen</div></div>
        <div class="stat-tegel"><div class="waarde">${dezeWeek}</div><div class="label">deze week</div></div>
        <div class="stat-tegel"><div class="waarde">${totaalVolume >= 1000 ? (totaalVolume / 1000).toFixed(1).replace(".", ",") + "t" : Math.round(totaalVolume)}</div><div class="label">totaal volume (kg)</div></div>
      </div>
      ${grafiekHtml || `<div class="leeg-melding"><span class="emoji">📈</span>Log eerst een paar trainingen — hier verschijnt dan je krachtprogressie per oefening.</div>`}
    `;

    const select = $("#prog-select", el);
    if (select) {
      select.addEventListener("change", (e) => { progressieKeuze = e.target.value; render(); });
      // tooltip op tik/hover
      const wrap = $("#grafiek-wrap", el);
      const punten = perOefening[progressieKeuze].slice().sort((a, b) => new Date(a.datum) - new Date(b.datum));
      wrap.addEventListener("click", (e) => {
        const doel = e.target.closest("[data-i]");
        const oude = $(".grafiek-tooltip", wrap);
        if (oude) oude.remove();
        if (!doel) return;
        const p = punten[Number(doel.dataset.i)];
        const tt = document.createElement("div");
        tt.className = "grafiek-tooltip";
        tt.innerHTML = `${fmtDatum(p.datum)}<br><strong>${fmtKg(p.kg)} kg × ${p.reps}</strong> · e1RM ${Math.round(p.e1rm)} kg`;
        const rect = wrap.getBoundingClientRect();
        tt.style.left = (e.clientX - rect.left) + "px";
        tt.style.top = (e.clientY - rect.top) + "px";
        wrap.appendChild(tt);
        // binnen de kaart houden
        const helft = tt.offsetWidth / 2;
        const links = Math.max(helft + 6, Math.min(rect.width - helft - 6, e.clientX - rect.left));
        tt.style.left = links + "px";
        if (e.clientY - rect.top < tt.offsetHeight + 12) tt.style.transform = "translate(-50%, 10%)";
        setTimeout(() => tt.remove(), 3000);
      });
    }
  }

  // ---------- Instellingen ----------
  function toonInstellingen() {
    const modal = toonModal(`
      <h2>Instellingen</h2>
      <div class="sectie-titel">Stang</div>
      <div class="instelling-rij">
        <label for="inst-stang">Gewicht van de stang (kg)</label>
        <input type="number" inputmode="decimal" id="inst-stang" step="0.5" min="0" value="${instellingen.stangKg}">
      </div>
      <div class="sectie-titel">Schijven (totaal aantal per gewicht)</div>
      ${instellingen.schijven
        .map(
          (s, i) => `
        <div class="instelling-rij">
          <label for="inst-schijf-${i}">${fmtKg(s.kg)} kg schijven</label>
          <input type="number" inputmode="numeric" id="inst-schijf-${i}" min="0" step="2" value="${s.aantal}">
        </div>`
        )
        .join("")}
      <button class="knop" data-actie="bewaar">Opslaan</button>
      <div class="sectie-titel">Gegevens</div>
      <button class="knop gevaar" data-actie="wis">Alle logboekgegevens wissen</button>
    `);
    $("[data-actie=bewaar]", modal).addEventListener("click", () => {
      instellingen.stangKg = parseFloat($("#inst-stang", modal).value.replace(",", ".")) || 0;
      instellingen.schijven = instellingen.schijven.map((s, i) => ({
        kg: s.kg,
        aantal: Math.max(0, parseInt($(`#inst-schijf-${i}`, modal).value, 10) || 0),
      }));
      bewaarAlles();
      sluitModal();
      render();
    });
    $("[data-actie=wis]", modal).addEventListener("click", () => {
      if (confirm("Weet je het zeker? Alle gelogde trainingen worden verwijderd.")) {
        logboek = [];
        actieveWorkout = null;
        bewaarAlles();
        sluitModal();
        render();
      }
    });
  }

  // ---------- Hoofd-render ----------
  const TABS = [
    { id: "oefeningen", label: "Oefeningen", icoon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/></svg>` },
    { id: "schemas", label: "Schema's", icoon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></svg>` },
    { id: "training", label: "Training", icoon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M7 5l11 7-11 7z"/></svg>` },
    { id: "progressie", label: "Progressie", icoon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 19h16M6 16l4-5 3 3 5-7"/></svg>` },
  ];

  function render() {
    const main = $("#weergave");
    const vers = document.createElement("div");
    if (huidigeTab === "oefeningen") renderOefeningen(vers);
    else if (huidigeTab === "schemas") renderSchemas(vers);
    else if (huidigeTab === "training") renderTraining(vers);
    else renderProgressie(vers);
    main.innerHTML = "";
    main.appendChild(vers);

    const tabbar = $("#tabbar");
    tabbar.innerHTML = TABS.map(
      (t) => `<button class="${huidigeTab === t.id ? "actief" : ""}" data-tab="${t.id}">${t.icoon}<span>${t.label}${t.id === "training" && actieveWorkout ? " ●" : ""}</span></button>`
    ).join("");
  }

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", () => {
    $("#tabbar").addEventListener("click", (e) => {
      const b = e.target.closest("[data-tab]");
      if (b) gaNaarTab(b.dataset.tab);
    });
    $("#instellingen-knop").addEventListener("click", toonInstellingen);
    render();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  });
})();
