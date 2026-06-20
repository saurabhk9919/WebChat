import React, { useMemo, useState } from 'react'

function AISummaryCard({
  summary,
  keyPoints = [],
  actionItems = [],
  decisions = [],
  limitLabel = 'Last 5 Messages',
  summaryTypeLabel = 'Brief',
  generatedAtLabel = 'Generated just now',
  isLoading = false,
  onCopy,
  onRegenerate,
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const summaryPreview = useMemo(() => {
    const lines = []

    if (summary && String(summary).trim()) {
      lines.push(String(summary).trim())
    }

    if (Array.isArray(keyPoints) && keyPoints.length > 0) {
      lines.push('', 'Key Points:', ...keyPoints.map((item) => `- ${item}`))
    }

    if (Array.isArray(actionItems) && actionItems.length > 0) {
      lines.push('', 'Action Items:', ...actionItems.map((item) => `- ${item}`))
    }

    if (Array.isArray(decisions) && decisions.length > 0) {
      lines.push('', 'Decisions:', ...decisions.map((item) => `- ${item}`))
    }

    return lines.join('\n').trim()
  }, [actionItems, decisions, keyPoints, summary])

  const sections = [
    {
      label: 'Summary',
      content: summary,
      type: 'text',
    },
    {
      label: 'Key Points',
      content: keyPoints,
      type: 'list',
    },
    {
      label: 'Action Items',
      content: actionItems,
      type: 'list',
    },
    {
      label: 'Decisions',
      content: decisions,
      type: 'list',
    },
  ]

  const hasContent =
    Boolean(summary && String(summary).trim()) ||
    keyPoints.length > 0 ||
    actionItems.length > 0 ||
    decisions.length > 0

  const handleCopy = async () => {
    if (!summaryPreview || !navigator?.clipboard?.writeText) {
      return
    }

    await navigator.clipboard.writeText(summaryPreview)
    onCopy?.()
  }

  return (
    <div className='w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 shadow-lg shadow-black/20 backdrop-blur-sm'>
      <button
        type='button'
        onClick={() => setIsExpanded((value) => !value)}
        className='flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-white/5'
        aria-expanded={isExpanded}
      >
        <div>
          <p className='text-sm font-semibold text-slate-100'>AI Summary {isExpanded ? '▲' : '▼'}</p>
          <p className='mt-1 text-xs text-slate-400'>
            {isLoading ? `✨ AI is reading ${limitLabel.toLowerCase()}... Generating summary...` : 'Collapsible conversation summary'}
          </p>
        </div>
        {!isLoading && (
          <div className='hidden flex-col items-end gap-1 text-right sm:flex'>
            <span className='text-[11px] uppercase tracking-[0.2em] text-slate-500'>{summaryTypeLabel}</span>
            <span className='text-[11px] text-slate-400'>{limitLabel}</span>
          </div>
        )}
      </button>

      {isExpanded && (
        <div className='border-t border-white/10 px-4 py-4'>
          <div className='flex flex-wrap items-center gap-2 border-b border-white/10 pb-3'>
            <span className='rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-200'>
              AI Summary
            </span>
            <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-300'>
              {summaryTypeLabel}
            </span>
            <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-300'>
              {limitLabel}
            </span>
            <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-400'>
              {generatedAtLabel}
            </span>
          </div>

          {isLoading ? (
            <div className='space-y-4 py-4'>
              <div className='rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm text-blue-100'>
                ✨ AI is reading {limitLabel.toLowerCase()}... Generating summary...
              </div>
              <div className='rounded-xl border border-white/10 bg-white/5 p-4'>
                <div className='h-4 w-2/3 animate-pulse rounded-full bg-white/10' />
                <div className='mt-3 space-y-2'>
                  <div className='h-3 w-full animate-pulse rounded-full bg-white/10' />
                  <div className='h-3 w-5/6 animate-pulse rounded-full bg-white/10' />
                  <div className='h-3 w-4/6 animate-pulse rounded-full bg-white/10' />
                </div>
              </div>
            </div>
          ) : !hasContent ? (
            <div className='rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-5 text-sm text-slate-400'>
              No summary available yet.
            </div>
          ) : (
            <div className='space-y-4'>
              {sections.map((section) => {
                const sectionHasContent =
                  section.type === 'text'
                    ? Boolean(section.content && String(section.content).trim())
                    : Array.isArray(section.content) && section.content.length > 0

                if (!sectionHasContent) {
                  return null
                }

                return (
                  <div key={section.label} className='rounded-xl border border-white/10 bg-white/5 p-4'>
                    <h3 className='text-sm font-semibold text-slate-100'>{section.label}</h3>

                    {section.type === 'text' ? (
                      <p className='mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300'>
                        {section.content}
                      </p>
                    ) : (
                      <ul className='mt-2 space-y-2'>
                        {section.content.map((item, index) => (
                          <li key={`${section.label}-${index}`} className='flex gap-2 text-sm leading-6 text-slate-300'>
                            <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400' />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}

              <div className='flex flex-wrap items-center justify-end gap-2 pt-1'>
                <button
                  type='button'
                  onClick={handleCopy}
                  disabled={!summaryPreview}
                  className='inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <span aria-hidden='true'>📋</span>
                  Copy Summary
                </button>
                <button
                  type='button'
                  onClick={onRegenerate}
                  disabled={!onRegenerate}
                  className='inline-flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-100 transition hover:bg-blue-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <span aria-hidden='true'>↻</span>
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AISummaryCard