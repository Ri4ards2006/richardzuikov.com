import React, { useState } from 'react';
import { posters } from '../data/portraits';
import PosterPortrait from '../components/atlus/PosterPortrait';
import { DEFAULT_PARAMS } from '../components/atlus/poster-gl';

// Dev-only poster lab (/?portrait-lab, v7 task 6): tune the shader live; copy the values into
// DEFAULT_PARAMS (poster-gl.js) when they look right. Never part of the production bundle.
const SLIDERS = [
  ['t1', 0, 1, 0.01], ['t2', 0, 1, 0.01], ['t3', 0, 1, 0.01], ['t4', 0, 1, 0.01],
  ['soft', 0, 0.15, 0.005], ['edge', 0, 4, 0.05], ['rim', 0, 6, 0.5],
];

export default function PortraitLab() {
  const ids = Object.keys(posters).filter((id) => posters[id]);
  const [id, setId] = useState(ids[0]);
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [colorReveal, setColorReveal] = useState(false);

  return (
    <div className="portrait-lab">
      <aside>
        <h1 className="font-anton text-3xl uppercase">Portrait lab</h1>
        {ids.length === 0 && <p className="mt-3 text-sm">No poster set yet. Put <code>about.png</code> into <code>src/assets/portraits/raw/</code> and run <code>npm run poster</code>.</p>}
        {ids.length > 1 && (
          <select value={id} onChange={(event) => setId(event.target.value)}>
            {ids.map((value) => <option key={value}>{value}</option>)}
          </select>
        )}
        {SLIDERS.map(([key, min, max, step]) => (
          <label key={key}>
            <span>{key} <output>{params[key]}</output></span>
            <input type="range" min={min} max={max} step={step} value={params[key]} onChange={(event) => setParams({ ...params, [key]: Number(event.target.value) })} />
          </label>
        ))}
        <label className="is-row">
          <input type="checkbox" checked={colorReveal} onChange={(event) => setColorReveal(event.target.checked)} />
          <span>colorReveal (hover dissolves into the colour photo)</span>
        </label>
        <button type="button" onClick={() => setParams(DEFAULT_PARAMS)}>reset</button>
        <pre>{JSON.stringify(params)}</pre>
      </aside>
      {id && (
        <div className="portrait-lab-stage">
          <figure>
            <PosterPortrait set={posters[id]} alt="" params={params} colorReveal={colorReveal} sizes="40vw" />
            <figcaption>shader</figcaption>
          </figure>
          <figure>
            <img src={posters[id].poster[posters[id].widths[0]].webp} alt="" />
            <figcaption>static fallback</figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
