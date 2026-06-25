/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PolicyProposal, PolicyCategory } from '../types';
import { ChevronRight, Plus, MapPin, DollarSign, Clock, Vote, MessageSquare, ShieldAlert, Sparkles, CheckCircle, Send } from 'lucide-react';

interface PolicyListProps {
  policies: PolicyProposal[];
  selectedPolicyId: string | null;
  onSelectPolicy: (policy: PolicyProposal) => void;
  probeCoords: { x: number; y: number } | null;
  onCreatePolicy: (policyData: any) => Promise<void>;
  onVote: (policyId: string, type: 'up' | 'down' | 'neutral') => Promise<void>;
  onAddComment: (policyId: string, author: string, text: string, role: string) => Promise<void>;
  isGenerating: boolean;
}

export default function PolicyList({
  policies,
  selectedPolicyId,
  onSelectPolicy,
  probeCoords,
  onCreatePolicy,
  onVote,
  onAddComment,
  isGenerating
}: PolicyListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PolicyCategory>('environment');
  const [xCoord, setXCoord] = useState<number>(50);
  const [yCoord, setYCoord] = useState<number>(50);
  const [zCoord, setZCoord] = useState<number>(0);
  const [intensity, setIntensity] = useState<number>(50);
  const [radius, setRadius] = useState<number>(20);
  const [cost, setCost] = useState<number>(45);
  const [duration, setDuration] = useState<number>(12);

  // New Comment Form states
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentRole, setCommentRole] = useState<'citizen' | 'expert' | 'planner'>('citizen');

  const selectedPolicy = policies.find(p => p.id === selectedPolicyId) || null;

  const handleUseProbe = () => {
    if (probeCoords) {
      setXCoord(probeCoords.x);
      setYCoord(probeCoords.y);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    await onCreatePolicy({
      title,
      description,
      category,
      coordinates: { x: xCoord, y: yCoord, z: zCoord },
      physicalParams: { intensity, radius, cost, duration }
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setShowCreateForm(false);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText || !selectedPolicyId) return;

    await onAddComment(selectedPolicyId, commentAuthor || 'Anonymous Citizen', commentText, commentRole);
    setCommentText('');
  };

  return (
    <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] rounded-none flex flex-col gap-4 mt-2">
      <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
        <h2 className="font-bold text-[#1A1A1A] tracking-tight text-sm flex items-center gap-2 font-serif">
          <MessageSquare className="w-5 h-5 text-black" />
          <span>Policy Proposals</span>
        </h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-[#1A1A1A] hover:bg-[#333333] text-white font-mono uppercase tracking-wider text-xs px-3 py-1.5 rounded-none border border-[#1A1A1A] flex items-center gap-1 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Propose
        </button>
      </div>

      {/* CREATE NEW POLICY PROPOSAL FORM OVERLAY */}
      {showCreateForm && (
        <form onSubmit={handleSubmitProposal} className="bg-[#EBE8E3]/60 border border-[#1A1A1A] p-4 rounded-none flex flex-col gap-4 animate-fadeIn text-[#1A1A1A]">
          <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
            <h3 className="font-bold text-[#1A1A1A] text-xs flex items-center gap-1.5 font-mono uppercase">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Draft Parameters</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="text-[#1A1A1A] hover:opacity-75 text-xs font-mono font-bold uppercase underline"
            >
              Cancel
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold font-mono text-black uppercase">Policy Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Sector G Solar Concentrator Matrix"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white border border-[#1A1A1A] rounded-none px-2.5 py-1.5 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold font-mono text-black uppercase">Core Intervention</label>
            <textarea
              required
              rows={2}
              placeholder="Detail the physical intervention, mechanical processes, or regulations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white border border-[#1A1A1A] rounded-none px-2.5 py-1.5 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold font-mono text-black uppercase">Sector Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="bg-white border border-[#1A1A1A] rounded-none px-2 py-1.5 text-xs text-black cursor-pointer focus:outline-none"
              >
                <option value="environment">Environment</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="energy">Energy</option>
                <option value="transport">Transport</option>
                <option value="health">Public Health</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold font-mono text-black uppercase">Coordinates</label>
                {probeCoords && (
                  <button
                    type="button"
                    onClick={handleUseProbe}
                    className="text-[9px] text-[#E05A36] font-mono hover:underline font-bold"
                  >
                    Set: ({probeCoords.x},{probeCoords.y})
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={xCoord}
                  onChange={(e) => setXCoord(Number(e.target.value))}
                  placeholder="X"
                  className="bg-white border border-[#1A1A1A] rounded-none p-1 text-xs text-center text-black focus:outline-none"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={yCoord}
                  onChange={(e) => setYCoord(Number(e.target.value))}
                  placeholder="Y"
                  className="bg-white border border-[#1A1A1A] rounded-none p-1 text-xs text-center text-black focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-[#1A1A1A] pt-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-bold font-mono text-black uppercase">
                <span>Active Sequestration Intensity</span>
                <span className="text-[#E05A36] font-bold">{intensity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="accent-[#1A1A1A] w-full cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-bold font-mono text-black uppercase">
                <span>Effective Core Radius</span>
                <span className="text-[#E05A36] font-bold">{radius} meters</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="accent-[#1A1A1A] w-full cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold font-mono text-black uppercase">Budget ($ Millions)</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  className="bg-white border border-[#1A1A1A] rounded-none px-2 py-1 text-xs text-black"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold font-mono text-black uppercase">Duration (Months)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="bg-white border border-[#1A1A1A] rounded-none px-2 py-1 text-xs text-black"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-none py-2 text-xs font-bold font-mono uppercase tracking-wider transition border border-[#1A1A1A] cursor-pointer mt-1"
          >
            Deploy Draft to Digital Twin Grid
          </button>
        </form>
      )}

      {/* POLICY BROWSER LIST */}
      <div className="flex flex-col gap-2.5 max-h-[250px] overflow-y-auto pr-1">
        {policies.map((p) => {
          const isSelected = p.id === selectedPolicyId;
          const totalVotes = p.votes.up + p.votes.down + p.votes.neutral;
          const approval = totalVotes > 0 ? Math.round((p.votes.up / totalVotes) * 100) : 50;

          return (
            <div
              key={p.id}
              onClick={() => onSelectPolicy(p)}
              className={`border p-3.5 cursor-pointer transition flex items-center justify-between ${
                isSelected
                  ? 'bg-[#EBE8E3] border-2 border-[#1A1A1A] shadow-none'
                  : 'bg-white border border-[#1A1A1A] hover:bg-[#F5F2ED]'
              }`}
            >
              <div className="flex flex-col gap-1 flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 border ${
                    p.category === 'environment' ? 'bg-emerald-100 text-emerald-800 border-emerald-600' :
                    p.category === 'transport' ? 'bg-amber-100 text-amber-800 border-amber-600' :
                    'bg-sky-100 text-sky-800 border-sky-600'
                  }`}>
                    {p.category}
                  </span>
                  <span className="text-[10px] font-mono text-[#1A1A1A] flex items-center gap-0.5 font-semibold">
                    <MapPin className="w-3 h-3 text-[#1A1A1A]" />
                    ({p.coordinates.x},{p.coordinates.y})
                  </span>
                </div>
                <h3 className="text-xs font-bold text-[#1A1A1A] truncate font-serif italic">{p.title}</h3>
              </div>

              {/* Approval Meter */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-mono font-bold ${approval >= 70 ? 'text-emerald-700' : approval >= 50 ? 'text-amber-700' : 'text-rose-700'}`}>
                    {approval}%
                  </span>
                  <span className="text-[9px] text-slate-600 font-mono uppercase font-bold">Approve</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition ${isSelected ? 'text-black transform translate-x-1' : 'text-slate-400'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED POLICY EXPANDED DETAIL WORKSPACE */}
      {selectedPolicy && (
        <div className="bg-[#EBE8E3]/40 border border-[#1A1A1A] p-4 flex flex-col gap-3 text-[#1A1A1A]">
          <div className="flex justify-between items-start gap-2 border-b border-[#1A1A1A] pb-2">
            <div>
              <span className="text-[9px] font-bold font-mono text-slate-600 uppercase">File ID: {selectedPolicy.id}</span>
              <h3 className="text-sm font-bold text-[#1A1A1A] mt-0.5 font-serif italic">{selectedPolicy.title}</h3>
            </div>
            <span className="text-[10px] bg-white border border-[#1A1A1A] text-[#1A1A1A] font-mono px-2 py-0.5 font-bold">
              Z-Axis: {selectedPolicy.coordinates.z}m
            </span>
          </div>

          <p className="text-xs text-[#1A1A1A]/95 leading-relaxed font-serif">{selectedPolicy.description}</p>

          {/* Core Specs Grid */}
          <div className="grid grid-cols-2 gap-2 bg-white p-2.5 border border-[#1A1A1A] text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[#1A1A1A]">
              <DollarSign className="w-3.5 h-3.5 text-[#E05A36]" />
              <span>Budget: <strong className="font-extrabold text-black">${selectedPolicy.physicalParams.cost}M</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[#1A1A1A]">
              <Clock className="w-3.5 h-3.5 text-black" />
              <span>Timeline: <strong className="font-extrabold text-black">{selectedPolicy.physicalParams.duration} mo</strong></span>
            </div>
          </div>

          {/* Democratic Voting Module */}
          <div className="border-t border-[#1A1A1A] pt-3 flex flex-col gap-2">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-black flex items-center gap-1">
              <Vote className="w-3.5 h-3.5 text-[#E05A36]" />
              <span>Submit Democratic Assessment</span>
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onVote(selectedPolicy.id, 'up')}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-600 rounded-none py-1.5 text-xs font-bold font-mono transition cursor-pointer"
              >
                Accept ({selectedPolicy.votes.up})
              </button>
              <button
                onClick={() => onVote(selectedPolicy.id, 'neutral')}
                className="bg-white hover:bg-slate-100 text-black border border-[#1A1A1A] rounded-none py-1.5 text-xs font-bold font-mono transition cursor-pointer"
              >
                Abstain ({selectedPolicy.votes.neutral})
              </button>
              <button
                onClick={() => onVote(selectedPolicy.id, 'down')}
                className="bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-600 rounded-none py-1.5 text-xs font-bold font-mono transition cursor-pointer"
              >
                Reject ({selectedPolicy.votes.down})
              </button>
            </div>
          </div>

          {/* Real-time Comments Thread */}
          <div className="border-t border-[#1A1A1A] pt-3 flex flex-col gap-2">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-black flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>Citizen Feedback Loop</span>
            </span>

            <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
              {selectedPolicy.comments.length === 0 ? (
                <div className="text-[11px] text-slate-600 italic py-2 text-center">No comments submitted yet.</div>
              ) : (
                selectedPolicy.comments.map((comment) => (
                  <div key={comment.id} className="bg-white border border-[#1A1A1A] p-2.5 rounded-none flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-black font-extrabold">{comment.author}</span>
                      <span className={`px-1.5 py-0.2 border text-[9px] font-bold uppercase ${
                        comment.role === 'expert' ? 'bg-purple-100 text-purple-800 border-purple-500' :
                        comment.role === 'planner' ? 'bg-sky-100 text-sky-800 border-sky-500' :
                        'bg-[#EBE8E3] text-black border-slate-500'
                      }`}>
                        {comment.role}
                      </span>
                    </div>
                    <p className="text-xs text-[#1A1A1A]/90 leading-normal font-serif italic">"{comment.text}"</p>
                  </div>
                ))
              )}
            </div>

            {/* Submit Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-1.5 mt-1 border-t border-[#1A1A1A] pt-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name / ID"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="bg-white border border-[#1A1A1A] px-2 py-1 text-[11px] text-black focus:outline-none"
                />
                <select
                  value={commentRole}
                  onChange={(e) => setCommentRole(e.target.value as any)}
                  className="bg-white border border-[#1A1A1A] px-1.5 py-1 text-[11px] text-black cursor-pointer"
                >
                  <option value="citizen">Citizen</option>
                  <option value="expert">Expert</option>
                  <option value="planner">Planner</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Type feedback here..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-white border border-[#1A1A1A] px-2.5 py-1 text-xs text-black focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#1A1A1A] hover:bg-[#333333] text-white p-1.5 flex items-center justify-center transition border border-[#1A1A1A] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
