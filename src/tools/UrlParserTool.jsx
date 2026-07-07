import { useEffect, useMemo } from 'react'
import { ToolShell, Panel, CodeInput } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { byteCount, copyText, getErrorMessage } from '../utils/devkit'

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

  const info = parsed.value

  return (
    <ToolShell
      title="URL Parser"
      description="Break a URL into its pieces and rebuild the query string interactively."
      error={parsed.error}
      actions={
        <>
          <button className="btn btn-secondary" onClick={() => copyText(builtUrl || input)} type="button">Copy URL</button>
          <button className="btn btn-danger" onClick={() => setInput('')} type="button">Clear</button>
        </>
      }
    >
      <div className="workspace workspace--cols-2">
        <Panel title="Input URL" flush meta={`${byteCount(input)} B`}>
          <CodeInput ariaLabel="Input URL" onChange={setInput} value={input} />
        </Panel>
        <Panel title="Breakdown" validity={parsed.error ? 'error' : info ? 'valid' : undefined} meta={info ? `${info.params.length} params` : ''}>
          {info ? (
            <>
              <div className="kv-row"><span className="kv-label">protocol</span><span className="kv-value">{info.protocol}</span></div>
              <div className="kv-row"><span className="kv-label">host</span><span className="kv-value">{info.host}</span></div>
              <div className="kv-row"><span className="kv-label">path</span><span className="kv-value">{info.pathname}</span></div>
              <div className="kv-row"><span className="kv-label">hash</span><span className="kv-value">{info.hash || '(none)'}</span></div>

              <p className="kv-section">Base &amp; hash</p>
              <div className="kv-row">
                <span className="kv-label">base</span>
                <input aria-label="Base URL" className="kv-input" onChange={(event) => setBuilderBase(event.target.value)} placeholder="Base URL" value={builderBase} />
              </div>
              <div className="kv-row">
                <span className="kv-label">hash</span>
                <input aria-label="Hash fragment" className="kv-input" onChange={(event) => setBuilderHash(event.target.value)} placeholder="#hash" value={builderHash} />
              </div>

              <p className="kv-section">Query parameters</p>
              {params.map(([key, value], index) => (
                <div className="kv-row" key={`${key}-${index}`}>
                  <input aria-label="Parameter key" className="kv-input" onChange={(event) => updateParam(index, [event.target.value, value])} placeholder="key" value={key} />
                  <input aria-label="Parameter value" className="kv-input" onChange={(event) => updateParam(index, [key, event.target.value])} placeholder="value" value={value} />
                  <button className="kv-remove" onClick={() => setParams(params.filter((_, entryIndex) => entryIndex !== index))} type="button">Remove</button>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={() => setParams([...params, ['', '']])} style={{ marginTop: '0.5rem' }} type="button">Add param</button>

              <p className="kv-section">Built URL</p>
              <div className="kv-row"><span className="kv-value">{builtUrl || 'Enter a valid base URL.'}</span></div>
            </>
          ) : (
            <p className="panel-placeholder">Enter a valid URL to inspect it.</p>
          )}
        </Panel>
      </div>
    </ToolShell>
  )
}
