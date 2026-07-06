import { useEffect, useMemo } from 'react'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText, getErrorMessage } from '../utils/devkit'

function parseQuery(url) {
  const parsed = new URL(url)
  return {
    protocol: parsed.protocol,
    host: parsed.host,
    pathname: parsed.pathname,
    hash: parsed.hash,
    origin: parsed.origin,
    params: [...parsed.searchParams.entries()],
  }
}

export function UrlParserTool() {
  const [input, setInput] = useLocalStorage('devkit-url-parser-input', 'https://example.dev/tools?format=json&theme=dark#output')
  const [builderBase, setBuilderBase] = useLocalStorage('devkit-url-parser-base', 'https://example.dev/tools')
  const [builderHash, setBuilderHash] = useLocalStorage('devkit-url-parser-hash', '#output')
  const [params, setParams] = useLocalStorage('devkit-url-parser-params', [
    ['format', 'json'],
    ['theme', 'dark'],
  ])

  const parsed = useMemo(() => {
    try {
      return { value: parseQuery(input), error: '' }
    } catch (problem) {
      return { value: null, error: getErrorMessage(problem) }
    }
  }, [input])

  useEffect(() => {
    if (!parsed.value) return
    setBuilderBase(`${parsed.value.origin}${parsed.value.pathname}`)
    setBuilderHash(parsed.value.hash)
    setParams(parsed.value.params.length ? parsed.value.params : [['', '']])
  }, [parsed.value, setBuilderBase, setBuilderHash, setParams])

  const builtUrl = useMemo(() => {
    try {
      const url = new URL(builderBase)
      url.search = ''
      params.forEach(([key, value]) => {
        if (key) url.searchParams.append(key, value)
      })
      url.hash = builderHash.replace(/^#?/, '#') === '#' ? '' : builderHash.replace(/^#?/, '#')
      return url.toString()
    } catch {
      return ''
    }
  }, [builderBase, builderHash, params])

  const updateParam = (index, next) => {
    setParams(params.map((entry, entryIndex) => (entryIndex === index ? next : entry)))
  }

  return (
    <ToolLayout
      description="Break a URL into its pieces and rebuild the query string interactively."
      error={parsed.error}
      onClear={() => setInput('')}
      onCopy={() => copyText(builtUrl || input)}
      title="URL Parser"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="Input URL">
          <input className="field" onChange={(event) => setInput(event.target.value)} value={input} />
          <div className="mt-4 space-y-3">
            <input className="field" onChange={(event) => setBuilderBase(event.target.value)} placeholder="Base URL" value={builderBase} />
            <input className="field" onChange={(event) => setBuilderHash(event.target.value)} placeholder="#hash" value={builderHash} />
            <div className="space-y-2">
              {params.map(([key, value], index) => (
                <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]" key={`${key}-${index}`}>
                  <input className="field" onChange={(event) => updateParam(index, [event.target.value, value])} placeholder="key" value={key} />
                  <input className="field" onChange={(event) => updateParam(index, [key, event.target.value])} placeholder="value" value={value} />
                  <button className="btn btn-secondary" onClick={() => setParams(params.filter((_, entryIndex) => entryIndex !== index))} type="button">
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button className="btn btn-secondary" onClick={() => setParams([...params, ['', '']])} type="button">
              Add param
            </button>
          </div>
        </Pane>
        <Pane title="Parsed output">
          {parsed.value ? (
            <div className="space-y-3 text-sm">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="output-block">Protocol: {parsed.value.protocol}</div>
                <div className="output-block">Host: {parsed.value.host}</div>
                <div className="output-block sm:col-span-2">Path: {parsed.value.pathname}</div>
                <div className="output-block sm:col-span-2">Hash: {parsed.value.hash || '(none)'}</div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800">
                    <tr>
                      <th className="px-3 py-2">Query key</th>
                      <th className="px-3 py-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(parsed.value.params.length ? parsed.value.params : [['(none)', '']]).map(([key, value], index) => (
                      <tr className="border-t border-slate-200 dark:border-slate-700" key={`${key}-${index}`}>
                        <td className="px-3 py-2 font-mono">{key}</td>
                        <td className="px-3 py-2 font-mono">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="output-block">Built URL: {builtUrl || 'Enter a valid base URL.'}</div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Enter a valid URL to inspect it.</p>
          )}
        </Pane>
      </div>
    </ToolLayout>
  )
}
