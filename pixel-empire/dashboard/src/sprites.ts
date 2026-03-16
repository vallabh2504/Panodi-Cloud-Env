import type { AgentId, AgentState } from './types';

// Colour palette — index maps to CSS colour string
export const PALETTE: string[] = [
  'transparent', // 0 _
  '#0F0F1A',     // 1 K  near-black
  '#FFFFFF',     // 2 W  white
  '#FDBCB4',     // 3 S  skin
  '#5D3A1A',     // 4 H  brown / dark hair
  '#FFD700',     // 5 G  gold
  '#9B59B6',     // 6 P  purple
  '#2980B9',     // 7 B  blue
  '#17BEBB',     // 8 C  cyan
  '#E67E22',     // 9 O  orange
  '#27AE60',     // 10 N green
  '#E74C3C',     // 11 R red
  '#F39C12',     // 12 Y amber
  '#1A1A2E',     // 13 E dark-eye / near-black
  '#95A5A6',     // 14 M metal-grey
  '#ECF0F1',     // 15 L light-grey
];

// Colour aliases
const [_,K,W,S,H,G,P,B,C,O,N,R,Y,E,M,L] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

// Each frame is a 16×16 number array
type Frame = number[][];

// ─── PANODU — Boss / Commander (gold crown, purple robe) ─────────────────────
const PANODU_IDLE_0: Frame = [
  [_,_,_,G,G,G,_,_,_,G,G,G,_,_,_,_],
  [_,_,_,G,G,G,G,G,G,G,G,G,G,_,_,_],
  [_,_,_,G,P,G,G,G,G,G,P,G,G,_,_,_],
  [_,_,_,_,P,P,P,P,P,P,P,P,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,S,E,E,S,S,E,E,S,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,_,H,S,S,S,S,H,_,_,_,_,_],
  [_,_,_,P,P,P,P,P,P,P,P,P,P,_,_,_],
  [_,_,P,P,P,P,P,P,P,P,P,P,P,P,_,_],
  [_,_,P,P,P,G,P,P,P,P,G,P,P,P,_,_],
  [_,_,P,P,W,W,P,P,P,P,W,W,P,P,_,_],
  [_,_,S,S,P,P,P,P,P,P,P,P,S,S,_,_],
  [_,_,_,P,P,G,P,P,P,P,G,P,P,_,_,_],
  [_,_,_,_,P,P,P,P,P,P,P,P,_,_,_,_],
  [_,_,_,_,H,H,P,P,P,P,H,H,_,_,_,_],
];

// Idle frame 1: arm slightly raised (chai-sipping pose)
const PANODU_IDLE_1: Frame = [
  [_,_,_,G,G,G,_,_,_,G,G,G,_,_,_,_],
  [_,_,_,G,G,G,G,G,G,G,G,G,G,_,_,_],
  [_,_,_,G,P,G,G,G,G,G,P,G,G,_,_,_],
  [_,_,_,_,P,P,P,P,P,P,P,P,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,S,E,E,S,S,E,E,S,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,_,H,S,S,S,S,H,_,_,_,_,_],
  [_,_,_,P,P,P,P,P,P,P,P,P,P,_,_,_],
  [_,_,P,P,P,P,P,P,P,P,P,P,P,P,_,_],
  [_,_,P,P,P,G,P,P,P,P,G,P,P,P,_,_],
  [_,S,W,W,P,P,P,P,P,P,W,W,P,P,_,_], // left arm raised
  [_,_,_,S,P,P,P,P,P,P,P,P,S,S,_,_],
  [_,_,_,P,P,G,P,P,P,P,G,P,P,_,_,_],
  [_,_,_,_,P,P,P,P,P,P,P,P,_,_,_,_],
  [_,_,_,_,H,H,P,P,P,P,H,H,_,_,_,_],
];

// Working: leaning forward, typing
const PANODU_WORK_0: Frame = [
  [_,_,_,G,G,G,_,_,_,G,G,G,_,_,_,_],
  [_,_,_,G,G,G,G,G,G,G,G,G,G,_,_,_],
  [_,_,_,G,P,G,G,G,G,G,P,G,G,_,_,_],
  [_,_,_,_,P,P,P,P,P,P,P,P,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,S,E,E,S,S,E,E,S,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,_,H,S,S,S,S,H,_,_,_,_,_],
  [_,_,_,P,P,P,P,P,P,P,P,P,P,_,_,_],
  [_,_,P,P,P,P,P,P,P,P,P,P,P,P,_,_],
  [_,_,P,P,P,G,P,P,P,P,G,P,P,P,_,_],
  [_,_,_,_,W,W,S,S,S,S,W,W,_,_,_,_], // arms extended forward
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_], // hands on keyboard
  [_,_,_,P,P,G,P,P,P,P,G,P,P,_,_,_],
  [_,_,_,_,P,P,P,P,P,P,P,P,_,_,_,_],
  [_,_,_,_,H,H,P,P,P,P,H,H,_,_,_,_],
];

const PANODU_WORK_1: Frame = [
  [_,_,_,G,G,G,_,_,_,G,G,G,_,_,_,_],
  [_,_,_,G,G,G,G,G,G,G,G,G,G,_,_,_],
  [_,_,_,G,P,G,G,G,G,G,P,G,G,_,_,_],
  [_,_,_,_,P,P,P,P,P,P,P,P,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,S,E,E,S,S,E,E,S,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,_,H,S,S,S,S,H,_,_,_,_,_],
  [_,_,_,P,P,P,P,P,P,P,P,P,P,_,_,_],
  [_,_,P,P,P,P,P,P,P,P,P,P,P,P,_,_],
  [_,_,P,P,P,G,P,P,P,P,G,P,P,P,_,_],
  [_,_,_,_,W,W,S,S,S,S,W,W,_,_,_,_],
  [_,_,_,_,_,S,S,S,S,S,S,_,_,_,_,_], // hands slightly up
  [_,_,_,P,P,G,P,P,P,P,G,P,P,_,_,_],
  [_,_,_,_,P,P,P,P,P,P,P,P,_,_,_,_],
  [_,_,_,_,H,H,P,P,P,P,H,H,_,_,_,_],
];

// ─── WA-GATEKEEPER — Guardian (green armour, shield) ─────────────────────────
const GATE_IDLE_0: Frame = [
  [_,_,_,_,N,N,N,N,N,N,N,N,_,_,_,_],
  [_,_,_,N,N,N,N,N,N,N,N,N,N,_,_,_],
  [_,_,_,N,W,W,W,W,W,W,W,W,N,_,_,_],
  [_,_,_,N,W,S,S,S,S,S,S,W,N,_,_,_],
  [_,_,_,N,W,S,E,E,S,E,E,W,N,_,_,_],
  [_,_,_,N,W,S,S,S,S,S,S,W,N,_,_,_],
  [_,_,_,N,N,N,N,N,N,N,N,N,N,_,_,_],
  [_,N,N,N,N,N,N,N,N,N,N,N,N,N,N,_],
  [_,M,N,N,N,N,N,N,N,N,N,N,N,N,M,_],
  [_,M,N,N,N,B,N,N,N,N,B,N,N,N,M,_],
  [M,M,N,N,W,W,N,N,N,N,W,W,N,N,M,M],
  [M,S,N,N,N,N,N,N,N,N,N,N,N,N,S,M],
  [_,M,N,N,N,N,N,N,N,N,N,N,N,N,M,_],
  [_,M,N,N,N,N,N,N,N,N,N,N,N,N,M,_],
  [_,_,M,N,N,N,_,_,_,_,N,N,N,M,_,_],
  [_,_,M,M,N,N,_,_,_,_,N,N,M,M,_,_],
];

// Idle frame 1: shield arm raised
const GATE_IDLE_1: Frame = [
  [_,_,_,_,N,N,N,N,N,N,N,N,_,_,_,_],
  [_,_,_,N,N,N,N,N,N,N,N,N,N,_,_,_],
  [_,_,_,N,W,W,W,W,W,W,W,W,N,_,_,_],
  [_,_,_,N,W,S,S,S,S,S,S,W,N,_,_,_],
  [_,_,_,N,W,S,E,E,S,E,E,W,N,_,_,_],
  [_,_,_,N,W,S,S,S,S,S,S,W,N,_,_,_],
  [_,_,_,N,N,N,N,N,N,N,N,N,N,_,_,_],
  [_,N,N,N,N,N,N,N,N,N,N,N,N,N,N,_],
  [_,M,N,N,N,N,N,N,N,N,N,N,N,N,M,_],
  [_,M,N,N,N,B,N,N,N,N,B,N,N,N,M,_],
  [M,S,W,W,N,N,N,N,N,N,W,W,N,N,M,M], // left arm up
  [M,_,_,M,N,N,N,N,N,N,N,N,N,N,S,M],
  [_,M,N,N,N,N,N,N,N,N,N,N,N,N,M,_],
  [_,M,N,N,N,N,N,N,N,N,N,N,N,N,M,_],
  [_,_,M,N,N,N,_,_,_,_,N,N,N,M,_,_],
  [_,_,M,M,N,N,_,_,_,_,N,N,M,M,_,_],
];

const GATE_WORK_0: Frame = [
  [_,_,_,_,N,N,N,N,N,N,N,N,_,_,_,_],
  [_,_,_,N,N,N,N,N,N,N,N,N,N,_,_,_],
  [_,_,_,N,W,W,W,W,W,W,W,W,N,_,_,_],
  [_,_,_,N,W,S,S,S,S,S,S,W,N,_,_,_],
  [_,_,_,N,W,S,E,E,S,E,E,W,N,_,_,_],
  [_,_,_,N,W,S,S,S,S,S,S,W,N,_,_,_],
  [_,_,_,N,N,N,N,N,N,N,N,N,N,_,_,_],
  [_,N,N,N,N,N,N,N,N,N,N,N,N,N,N,_],
  [_,M,N,N,N,N,N,N,N,N,N,N,N,N,M,_],
  [_,_,M,W,W,B,N,N,N,B,W,W,M,_,_,_],  // arms extended
  [_,_,S,S,N,N,N,N,N,N,N,N,S,S,_,_], // hands forward
  [_,_,_,_,N,N,N,N,N,N,N,N,_,_,_,_],
  [_,M,N,N,N,N,N,N,N,N,N,N,N,N,M,_],
  [_,M,N,N,N,N,N,N,N,N,N,N,N,N,M,_],
  [_,_,M,N,N,N,_,_,_,_,N,N,N,M,_,_],
  [_,_,M,M,N,N,_,_,_,_,N,N,M,M,_,_],
];

const GATE_WORK_1: Frame = [
  [_,_,_,_,N,N,N,N,N,N,N,N,_,_,_,_],
  [_,_,_,N,N,N,N,N,N,N,N,N,N,_,_,_],
  [_,_,_,N,W,W,W,W,W,W,W,W,N,_,_,_],
  [_,_,_,N,W,S,S,S,S,S,S,W,N,_,_,_],
  [_,_,_,N,W,S,E,E,S,E,E,W,N,_,_,_],
  [_,_,_,N,W,S,S,S,S,S,S,W,N,_,_,_],
  [_,_,_,N,N,N,N,N,N,N,N,N,N,_,_,_],
  [_,N,N,N,N,N,N,N,N,N,N,N,N,N,N,_],
  [_,M,N,N,N,N,N,N,N,N,N,N,N,N,M,_],
  [_,_,M,W,W,B,N,N,N,B,W,W,M,_,_,_],
  [_,_,_,S,S,N,N,N,N,N,S,S,_,_,_,_], // slight variation
  [_,_,_,_,N,N,N,N,N,N,N,N,_,_,_,_],
  [_,M,N,N,N,N,N,N,N,N,N,N,N,N,M,_],
  [_,M,N,N,N,N,N,N,N,N,N,N,N,N,M,_],
  [_,_,M,N,N,N,_,_,_,_,N,N,N,M,_,_],
  [_,_,M,M,N,N,_,_,_,_,N,N,M,M,_,_],
];

// ─── ARCHITECT-PRO — Builder (orange hard hat, blue overalls) ─────────────────
const ARCH_IDLE_0: Frame = [
  [_,_,_,O,O,O,O,O,O,O,O,O,O,_,_,_],
  [_,_,O,O,O,O,O,O,O,O,O,O,O,O,_,_],
  [_,_,O,O,O,O,O,O,O,O,O,O,O,O,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,S,S,E,S,S,E,S,S,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,S,H,S,S,S,S,H,S,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,B,B,B,_,_,_],
  [_,_,B,B,B,O,B,B,B,B,O,B,B,B,_,_],
  [_,_,B,B,B,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,B,B,O,O,B,B,B,B,O,O,B,B,_,_],
  [_,_,B,B,O,O,B,B,B,B,O,O,B,B,_,_],
  [_,_,S,S,B,B,B,B,B,B,B,B,S,S,_,_],
  [_,_,_,B,B,B,B,B,B,B,B,B,B,_,_,_],
  [_,_,_,H,H,B,B,_,_,B,B,H,H,_,_,_],
  [_,_,H,H,B,B,_,_,_,_,B,B,H,H,_,_],
];

const ARCH_IDLE_1: Frame = [
  [_,_,_,O,O,O,O,O,O,O,O,O,O,_,_,_],
  [_,_,O,O,O,O,O,O,O,O,O,O,O,O,_,_],
  [_,_,O,O,O,O,O,O,O,O,O,O,O,O,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,S,S,E,S,S,E,S,S,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,S,H,S,S,S,S,H,S,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,B,B,B,_,_,_],
  [_,_,B,B,B,O,B,B,B,B,O,B,B,B,_,_],
  [_,_,B,B,B,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,B,B,O,O,B,B,B,B,O,O,B,B,_,_],
  [_,S,W,W,O,O,B,B,B,B,O,O,B,B,_,_], // tool/pencil raised
  [_,_,_,S,B,B,B,B,B,B,B,B,S,S,_,_],
  [_,_,_,B,B,B,B,B,B,B,B,B,B,_,_,_],
  [_,_,_,H,H,B,B,_,_,B,B,H,H,_,_,_],
  [_,_,H,H,B,B,_,_,_,_,B,B,H,H,_,_],
];

const ARCH_WORK_0: Frame = [
  [_,_,_,O,O,O,O,O,O,O,O,O,O,_,_,_],
  [_,_,O,O,O,O,O,O,O,O,O,O,O,O,_,_],
  [_,_,O,O,O,O,O,O,O,O,O,O,O,O,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,S,S,E,S,S,E,S,S,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,S,H,S,S,S,S,H,S,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,B,B,B,_,_,_],
  [_,_,B,B,B,O,B,B,B,B,O,B,B,B,_,_],
  [_,_,_,_,W,W,S,S,S,S,W,W,_,_,_,_], // arms forward
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_], // hands on blueprint
  [_,_,_,_,B,B,B,B,B,B,B,B,_,_,_,_],
  [_,_,_,_,B,B,B,B,B,B,B,B,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,B,B,B,_,_,_],
  [_,_,_,H,H,B,B,_,_,B,B,H,H,_,_,_],
  [_,_,H,H,B,B,_,_,_,_,B,B,H,H,_,_],
];

const ARCH_WORK_1: Frame = [
  [_,_,_,O,O,O,O,O,O,O,O,O,O,_,_,_],
  [_,_,O,O,O,O,O,O,O,O,O,O,O,O,_,_],
  [_,_,O,O,O,O,O,O,O,O,O,O,O,O,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,S,S,E,S,S,E,S,S,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,S,H,S,S,S,S,H,S,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,B,B,B,_,_,_],
  [_,_,B,B,B,O,B,B,B,B,O,B,B,B,_,_],
  [_,_,_,_,W,W,S,S,S,S,W,W,_,_,_,_],
  [_,_,_,_,_,S,S,S,S,S,S,_,_,_,_,_], // hands slightly up
  [_,_,_,_,B,B,B,B,B,B,B,B,_,_,_,_],
  [_,_,_,_,B,B,B,B,B,B,B,B,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,B,B,B,_,_,_],
  [_,_,_,H,H,B,B,_,_,B,B,H,H,_,_,_],
  [_,_,H,H,B,B,_,_,_,_,B,B,H,H,_,_],
];

// ─── AUDITOR-PRO — Inspector (glasses, dark suit, clipboard) ─────────────────
const AUDI_IDLE_0: Frame = [
  [_,_,_,_,H,H,H,H,H,H,H,H,_,_,_,_],
  [_,_,_,H,H,H,H,H,H,H,H,H,H,_,_,_],
  [_,_,H,H,H,H,S,S,S,S,H,H,H,H,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,S,C,C,S,S,C,C,S,_,_,_,_],  // C = cyan glasses frames
  [_,_,_,_,S,C,E,C,C,E,C,S,_,_,_,_],  // eyes through lenses
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,_,H,S,S,S,S,H,_,_,_,_,_],
  [_,_,_,P,P,P,P,P,P,P,P,P,P,_,_,_],
  [_,_,P,W,P,P,P,P,P,P,P,P,W,P,_,_],
  [_,_,P,W,P,P,P,P,P,P,P,P,W,P,_,_],
  [_,_,P,P,W,P,P,P,P,P,P,W,P,P,_,_],
  [_,_,S,P,P,P,P,P,P,P,P,P,P,S,_,_],
  [_,_,_,P,P,P,P,P,P,P,P,P,P,_,_,_],
  [_,_,_,_,P,P,P,P,P,P,P,P,_,_,_,_],
  [_,_,_,_,H,H,P,P,P,P,H,H,_,_,_,_],
];

const AUDI_IDLE_1: Frame = [
  [_,_,_,_,H,H,H,H,H,H,H,H,_,_,_,_],
  [_,_,_,H,H,H,H,H,H,H,H,H,H,_,_,_],
  [_,_,H,H,H,H,S,S,S,S,H,H,H,H,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,S,C,C,S,S,C,C,S,_,_,_,_],
  [_,_,_,_,S,C,E,C,C,E,C,S,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,_,H,S,S,S,S,H,_,_,_,_,_],
  [_,_,_,P,P,P,P,P,P,P,P,P,P,_,_,_],
  [_,_,P,W,P,P,P,P,P,P,P,P,W,P,_,_],
  [_,_,P,W,P,P,P,P,P,P,P,P,W,P,_,_],
  [_,S,W,P,W,P,P,P,P,P,P,W,P,P,_,_], // clipboard raised
  [_,_,_,S,P,P,P,P,P,P,P,P,P,S,_,_],
  [_,_,_,P,P,P,P,P,P,P,P,P,P,_,_,_],
  [_,_,_,_,P,P,P,P,P,P,P,P,_,_,_,_],
  [_,_,_,_,H,H,P,P,P,P,H,H,_,_,_,_],
];

const AUDI_WORK_0: Frame = [
  [_,_,_,_,H,H,H,H,H,H,H,H,_,_,_,_],
  [_,_,_,H,H,H,H,H,H,H,H,H,H,_,_,_],
  [_,_,H,H,H,H,S,S,S,S,H,H,H,H,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,S,C,C,S,S,C,C,S,_,_,_,_],
  [_,_,_,_,S,C,E,C,C,E,C,S,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,_,H,S,S,S,S,H,_,_,_,_,_],
  [_,_,_,P,P,P,P,P,P,P,P,P,P,_,_,_],
  [_,_,P,W,P,P,P,P,P,P,P,P,W,P,_,_],
  [_,_,_,_,W,W,S,S,S,S,W,W,_,_,_,_], // arms extended
  [_,_,_,_,S,S,S,L,L,S,S,S,_,_,_,_], // pen/writing
  [_,_,_,_,P,P,P,P,P,P,P,P,_,_,_,_],
  [_,_,_,P,P,P,P,P,P,P,P,P,P,_,_,_],
  [_,_,_,_,P,P,P,P,P,P,P,P,_,_,_,_],
  [_,_,_,_,H,H,P,P,P,P,H,H,_,_,_,_],
];

const AUDI_WORK_1: Frame = [
  [_,_,_,_,H,H,H,H,H,H,H,H,_,_,_,_],
  [_,_,_,H,H,H,H,H,H,H,H,H,H,_,_,_],
  [_,_,H,H,H,H,S,S,S,S,H,H,H,H,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,S,C,C,S,S,C,C,S,_,_,_,_],
  [_,_,_,_,S,C,E,C,C,E,C,S,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_],
  [_,_,_,_,_,H,S,S,S,S,H,_,_,_,_,_],
  [_,_,_,P,P,P,P,P,P,P,P,P,P,_,_,_],
  [_,_,P,W,P,P,P,P,P,P,P,P,W,P,_,_],
  [_,_,_,_,W,W,S,S,S,S,W,W,_,_,_,_],
  [_,_,_,_,_,S,S,L,L,S,S,_,_,_,_,_], // pen up
  [_,_,_,_,P,P,P,P,P,P,P,P,_,_,_,_],
  [_,_,_,P,P,P,P,P,P,P,P,P,P,_,_,_],
  [_,_,_,_,P,P,P,P,P,P,P,P,_,_,_,_],
  [_,_,_,_,H,H,P,P,P,P,H,H,_,_,_,_],
];

// ─── CLAUDE WORKER — AI Robot (cyan chassis, glowing LED eyes) ────────────────
const CLAUD_IDLE_0: Frame = [
  [_,_,_,_,_,_,C,C,C,C,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,C,C,_,_,_,_,_,_,_],
  [_,_,_,_,C,C,C,C,C,C,C,C,_,_,_,_],
  [_,_,_,C,C,C,C,C,C,C,C,C,C,_,_,_],
  [_,_,_,C,K,Y,Y,K,K,Y,Y,K,C,_,_,_],  // LED eyes
  [_,_,_,C,C,C,C,C,C,C,C,C,C,_,_,_],
  [_,_,_,C,C,R,C,C,C,C,R,C,C,_,_,_],  // speaker indicators
  [_,_,_,_,C,C,C,C,C,C,C,C,_,_,_,_],
  [_,_,C,C,C,C,C,C,C,C,C,C,C,C,_,_],
  [_,_,C,M,C,C,C,C,C,C,C,C,M,C,_,_],
  [_,_,C,M,C,Y,C,C,C,C,Y,C,M,C,_,_],
  [_,M,C,C,W,W,C,C,C,C,W,W,C,C,M,_],
  [_,M,C,C,C,C,C,C,C,C,C,C,C,C,M,_],
  [_,_,C,C,C,C,C,C,C,C,C,C,C,C,_,_],
  [_,_,_,C,M,C,C,_,_,C,C,M,C,_,_,_],
  [_,_,M,M,C,C,_,_,_,_,C,C,M,M,_,_],
];

const CLAUD_IDLE_1: Frame = [
  [_,_,_,_,_,_,C,C,C,C,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,C,C,_,_,_,_,_,_,_],
  [_,_,_,_,C,C,C,C,C,C,C,C,_,_,_,_],
  [_,_,_,C,C,C,C,C,C,C,C,C,C,_,_,_],
  [_,_,_,C,K,Y,Y,K,K,Y,Y,K,C,_,_,_],
  [_,_,_,C,C,C,C,C,C,C,C,C,C,_,_,_],
  [_,_,_,C,C,R,C,C,C,C,R,C,C,_,_,_],
  [_,_,_,_,C,C,C,C,C,C,C,C,_,_,_,_],
  [_,_,C,C,C,C,C,C,C,C,C,C,C,C,_,_],
  [_,_,C,M,C,C,C,C,C,C,C,C,M,C,_,_],
  [_,_,C,M,C,Y,C,C,C,C,Y,C,M,C,_,_],
  [M,C,C,C,W,W,C,C,C,C,W,W,C,C,C,_], // arm slightly shifted
  [_,M,_,C,C,C,C,C,C,C,C,C,C,C,M,_],
  [_,_,C,C,C,C,C,C,C,C,C,C,C,C,_,_],
  [_,_,_,C,M,C,C,_,_,C,C,M,C,_,_,_],
  [_,_,M,M,C,C,_,_,_,_,C,C,M,M,_,_],
];

const CLAUD_WORK_0: Frame = [
  [_,_,_,_,_,_,C,C,C,C,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,C,C,_,_,_,_,_,_,_],
  [_,_,_,_,C,C,C,C,C,C,C,C,_,_,_,_],
  [_,_,_,C,C,C,C,C,C,C,C,C,C,_,_,_],
  [_,_,_,C,K,C,Y,K,K,Y,C,K,C,_,_,_],  // eyes scanning
  [_,_,_,C,C,C,C,C,C,C,C,C,C,_,_,_],
  [_,_,_,C,C,Y,C,C,C,C,Y,C,C,_,_,_],  // active indicators
  [_,_,_,_,C,C,C,C,C,C,C,C,_,_,_,_],
  [_,_,C,C,C,C,C,C,C,C,C,C,C,C,_,_],
  [_,_,_,_,W,W,C,C,C,C,W,W,_,_,_,_], // arms extended forward
  [_,_,_,_,C,C,C,C,C,C,C,C,_,_,_,_],
  [_,_,_,_,C,Y,C,C,C,C,Y,C,_,_,_,_], // chest lit up
  [_,_,_,_,C,C,C,C,C,C,C,C,_,_,_,_],
  [_,_,C,C,C,C,C,C,C,C,C,C,C,C,_,_],
  [_,_,_,C,M,C,C,_,_,C,C,M,C,_,_,_],
  [_,_,M,M,C,C,_,_,_,_,C,C,M,M,_,_],
];

const CLAUD_WORK_1: Frame = [
  [_,_,_,_,_,_,C,C,C,C,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,C,C,_,_,_,_,_,_,_],
  [_,_,_,_,C,C,C,C,C,C,C,C,_,_,_,_],
  [_,_,_,C,C,C,C,C,C,C,C,C,C,_,_,_],
  [_,_,_,C,K,Y,C,K,K,C,Y,K,C,_,_,_],  // eyes blinking
  [_,_,_,C,C,C,C,C,C,C,C,C,C,_,_,_],
  [_,_,_,C,C,Y,C,C,C,C,Y,C,C,_,_,_],
  [_,_,_,_,C,C,C,C,C,C,C,C,_,_,_,_],
  [_,_,C,C,C,C,C,C,C,C,C,C,C,C,_,_],
  [_,_,_,_,W,W,C,C,C,C,W,W,_,_,_,_],
  [_,_,_,_,_,C,C,C,C,C,C,_,_,_,_,_], // hands slightly back
  [_,_,_,_,C,Y,C,C,C,C,Y,C,_,_,_,_],
  [_,_,_,_,C,C,C,C,C,C,C,C,_,_,_,_],
  [_,_,C,C,C,C,C,C,C,C,C,C,C,C,_,_],
  [_,_,_,C,M,C,C,_,_,C,C,M,C,_,_,_],
  [_,_,M,M,C,C,_,_,_,_,C,C,M,M,_,_],
];

// ─── Sprite registry ─────────────────────────────────────────────────────────

export type SpriteSet = Record<AgentState, Frame[]>;

export const SPRITES: Record<AgentId, SpriteSet> = {
  'panodu': {
    idle:    [PANODU_IDLE_0, PANODU_IDLE_1],
    working: [PANODU_WORK_0, PANODU_WORK_1],
    alert:   [PANODU_IDLE_0, PANODU_IDLE_1],
  },
  'wa-gatekeeper': {
    idle:    [GATE_IDLE_0,  GATE_IDLE_1],
    working: [GATE_WORK_0,  GATE_WORK_1],
    alert:   [GATE_IDLE_0,  GATE_IDLE_1],
  },
  'architect-pro': {
    idle:    [ARCH_IDLE_0,  ARCH_IDLE_1],
    working: [ARCH_WORK_0,  ARCH_WORK_1],
    alert:   [ARCH_IDLE_0,  ARCH_IDLE_1],
  },
  'auditor-pro': {
    idle:    [AUDI_IDLE_0,  AUDI_IDLE_1],
    working: [AUDI_WORK_0,  AUDI_WORK_1],
    alert:   [AUDI_IDLE_0,  AUDI_IDLE_1],
  },
  'claude-worker': {
    idle:    [CLAUD_IDLE_0, CLAUD_IDLE_1],
    working: [CLAUD_WORK_0, CLAUD_WORK_1],
    alert:   [CLAUD_IDLE_0, CLAUD_IDLE_1],
  },
};
