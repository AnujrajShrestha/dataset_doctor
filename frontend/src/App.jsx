import { useEffect, useMemo, useRef, useState } from "react";

import {
  Activity,
  AlertCircle,
  BarChart3,
  Check,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Database,
  Download,
  FileBarChart,
  FileJson,
  FileSpreadsheet,
  FileText,
  HeartPulse,
  Loader2,
  Microscope,
  RefreshCw,
  ScanSearch,
  Server,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
  X,
  Zap,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL;

const ACCEPTED_EXTENSIONS = [".csv", ".xlsx", ".xls", ".json"];

function AnimatedBackground() {
  return (
    <div className="app-background">
      <div className="grid-background" />

      <div className="glow-orb one" />
      <div className="glow-orb two" />
      <div className="glow-orb three" />

      <svg
        className="svg-lines"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path d="M-100 300 C250 50, 450 600, 800 250 S1250 100, 1550 450" />
        <path d="M-100 650 C300 350, 500 850, 850 500 S1200 350, 1550 700" />
        <path d="M100 100 C350 400, 700 0, 1050 350 S1300 700, 1550 250" />
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
        <Stethoscope className="h-5 w-5 text-blue-400" />

        <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/60" />
      </div>

      <div>
        <div className="text-lg font-bold tracking-tight text-white">
          Dataset <span className="text-blue-400">Doctor</span>
        </div>

        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          AI Dataset Diagnosis
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ online }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
        online
          ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-400"
          : "border-red-400/20 bg-red-400/5 text-red-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          online ? "bg-emerald-400" : "bg-red-400"
        }`}
      />

      {online ? "API Online" : "API Offline"}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, description, danger }) {
  return (
    <div className="glass glass-hover rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            danger
              ? "bg-red-400/10 text-red-400"
              : "bg-blue-400/10 text-blue-400"
          }`}
        >
          <Icon size={19} />
        </div>

        <Activity size={16} className="text-slate-700" />
      </div>

      <div className="text-2xl font-bold text-white">
        {value ?? "—"}
      </div>

      <div className="mt-1 text-sm font-medium text-slate-300">
        {label}
      </div>

      {description && (
        <div className="mt-2 text-xs text-slate-500">
          {description}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
        <Icon size={17} />
      </div>

      <h2 className="font-semibold text-white">{children}</h2>
    </div>
  );
}

function getFileIcon(file) {
  if (!file) return FileText;

  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "json") return FileJson;

  if (["xlsx", "xls"].includes(ext)) {
    return FileSpreadsheet;
  }

  return FileText;
}

function formatBytes(bytes) {
  if (!bytes) return "0 KB";

  const kb = bytes / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  return `${(kb / 1024).toFixed(2)} MB`;
}

function findValue(obj, keys) {
  if (!obj || typeof obj !== "object") return null;

  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key];
    }
  }

  return null;
}

function getReadiness(report) {
  if (!report || typeof report !== "object") {
    return null;
  }

  const value = findValue(report, [
    "ml_readiness",
    "ML Readiness",
    "ml_readiness_score",
    "readiness",
    "score",
  ]);

  if (typeof value === "number") {
    return value > 1 ? value : value * 100;
  }

  if (typeof value === "string") {
    const match = value.match(/(\d+(?:\.\d+)?)\s*%?/);

    if (match) {
      return Number(match[1]);
    }
  }

  return null;
}

function normalizeList(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(/\n|•|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function ReportView({ report, plotFiles }) {
  const readiness = getReadiness(report);

  const missing = normalizeList(
    findValue(report, [
      "missing_data",
      "missing",
      "Missing data",
      "missing_values",
    ])
  );

  const imbalance = normalizeList(
    findValue(report, [
      "imbalance",
      "class_imbalance",
      "Imbalance",
    ])
  );

  const outliers = normalizeList(
    findValue(report, [
      "outliers",
      "Outliers",
      "outlier_analysis",
    ])
  );

  const recommendations = normalizeList(
    findValue(report, [
      "recommendations",
      "prescriptions",
      "Recommendations",
      "recommendation",
    ])
  );

  const reportText =
    typeof report === "string"
      ? report
      : report?.report || report?.summary || null;

  return (
    <div className="fade-in space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ShieldCheck}
          label="ML Readiness"
          value={
            readiness !== null
              ? `${Math.round(readiness)}%`
              : "Available"
          }
          description="Overall model-readiness assessment"
        />

        <StatCard
          icon={CircleAlert}
          label="Missing Data"
          value={missing.length || "Reviewed"}
          description="Missing-value findings"
          danger={missing.length > 0}
        />

        <StatCard
          icon={BarChart3}
          label="Imbalance"
          value={imbalance.length || "Reviewed"}
          description="Class distribution findings"
        />

        <StatCard
          icon={ScanSearch}
          label="Outliers"
          value={outliers.length || "Reviewed"}
          description="Potential anomaly findings"
          danger={outliers.length > 0}
        />
      </div>

      {readiness !== null && (
        <div className="glass rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">
                Machine Learning Readiness
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Based on the Dataset Doctor analysis
              </p>
            </div>

            <div className="text-3xl font-bold text-white">
              {Math.round(readiness)}%
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 transition-all duration-1000"
              style={{
                width: `${Math.min(Math.max(readiness, 0), 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <FindingCard
          icon={AlertCircle}
          title="Missing Data"
          items={missing}
          empty="No structured missing-data findings returned."
        />

        <FindingCard
          icon={BarChart3}
          title="Class Imbalance"
          items={imbalance}
          empty="No structured imbalance findings returned."
        />

        <FindingCard
          icon={ScanSearch}
          title="Outliers"
          items={outliers}
          empty="No structured outlier findings returned."
        />

        <FindingCard
          icon={ClipboardCheck}
          title="Recommendations"
          items={recommendations}
          empty="No structured recommendations returned."
        />
      </div>

      {reportText && (
        <div className="glass rounded-2xl p-6">
          <SectionTitle icon={FileText}>
            Doctor's Summary
          </SectionTitle>

          <div className="report-content rounded-xl border border-slate-800 bg-slate-950/50 p-5 text-sm leading-7 text-slate-300">
            {reportText}
          </div>
        </div>
      )}

      {report && !reportText && (
        <div className="glass rounded-2xl p-6">
          <SectionTitle icon={Microscope}>
            Complete Doctor Report
          </SectionTitle>

          <pre className="report-content overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 p-5 text-xs leading-6 text-slate-300">
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      )}

      {plotFiles?.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <SectionTitle icon={FileBarChart}>
            Generated Visualizations
          </SectionTitle>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {plotFiles.map((plot, index) => {
              const src = getPlotUrl(plot);

              return (
                <div
                  key={`${plot}-${index}`}
                  className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50"
                >
                  {src ? (
                    <img
                      src={src}
                      alt={`Dataset analysis plot ${index + 1}`}
                      className="h-auto w-full object-contain"
                    />
                  ) : (
                    <div className="p-4 text-sm text-slate-400">
                      {String(plot)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function FindingCard({ icon: Icon, title, items, empty }) {
  return (
    <div className="glass rounded-2xl p-6">
      <SectionTitle icon={Icon}>{title}</SectionTitle>

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4"
            >
              <ChevronRight
                size={17}
                className="mt-0.5 shrink-0 text-blue-400"
              />

              <span className="text-sm leading-6 text-slate-300">
                {typeof item === "object"
                  ? JSON.stringify(item)
                  : String(item)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-800 p-5 text-sm text-slate-500">
          {empty}
        </div>
      )}
    </div>
  );
}

function getPlotUrl(plot) {
  if (!plot) return null;

  if (typeof plot === "object") {
    plot = plot.url || plot.path || plot.file || plot.filename;
  }

  if (!plot || typeof plot !== "string") {
    return null;
  }

  if (plot.startsWith("http://") || plot.startsWith("https://")) {
    return plot;
  }

  if (plot.startsWith("/")) {
    return `${API_URL}${plot}`;
  }

  if (plot.includes("plots/")) {
    const clean = plot.substring(plot.indexOf("plots/"));
    return `${API_URL}/${clean.replaceAll("\\", "/")}`;
  }

  return `${API_URL}/plots/${plot.replaceAll("\\", "/")}`;
}

function App() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [apiOnline, setApiOnline] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    checkApi();
  }, []);

  const FileIcon = useMemo(() => getFileIcon(file), [file]);

  async function checkApi() {
    try {
      const response = await fetch(`${API_URL}/`);

      setApiOnline(response.ok);
    } catch {
      setApiOnline(false);
    }
  }

  function validateFile(selectedFile) {
    if (!selectedFile) return false;

    const extension = `.${selectedFile.name
      .split(".")
      .pop()
      ?.toLowerCase()}`;

    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      setError(
        "Unsupported file type. Please upload CSV, XLSX, XLS, or JSON."
      );

      return false;
    }

    setError("");

    return true;
  }

  function selectFile(selectedFile) {
    if (!validateFile(selectedFile)) return;

    setFile(selectedFile);
    setResult(null);
    setError("");
  }

  function handleFileInput(event) {
    const selectedFile = event.target.files?.[0];

    selectFile(selectedFile);
  }

  function handleDrop(event) {
    event.preventDefault();

    setDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    selectFile(droppedFile);
  }

  function removeFile() {
    setFile(null);
    setResult(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function diagnoseDataset() {
    if (!file) {
      setError("Please select a dataset first.");
      return;
    }

    setLoading(true);
    setProgress(10);
    setError("");
    setResult(null);

    const formData = new FormData();

    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${API_URL}/diagnose`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const uploadProgress =
          (event.loaded / event.total) * 70;

        setProgress(Math.min(Math.round(uploadProgress), 70));
      }
    };

    xhr.onload = () => {
      setProgress(85);

      try {
        const data = JSON.parse(xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100);
          setResult(data);
          setApiOnline(true);
        } else {
          throw new Error(
            data?.detail ||
              data?.message ||
              "Dataset diagnosis failed."
          );
        }
      } catch (err) {
        setError(
          err.message || "Something went wrong while processing."
        );

        setApiOnline(xhr.status !== 0);
      } finally {
        setLoading(false);
      }
    };

    xhr.onerror = () => {
      setLoading(false);
      setProgress(0);
      setApiOnline(false);

      setError(
        `Unable to connect to Dataset Doctor API at ${API_URL}.`
      );
    };

    xhr.send(formData);
  }

  function reset() {
    setFile(null);
    setResult(null);
    setError("");
    setProgress(0);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const doctorReport =
    result?.doctor_report ||
    result?.report ||
    result?.doctorReport ||
    null;

  const plotFiles =
    result?.plot_files ||
    result?.plots ||
    [];

  const reportPath =
    result?.report_path ||
    result?.reportPath ||
    null;

  return (
    <div className="min-h-screen overflow-x-hidden text-slate-200">
      <AnimatedBackground />

      {/* NAVBAR */}

      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo />

          <div className="flex items-center gap-3">
            <StatusBadge online={apiOnline} />

            <a
              href={`${API_URL}/docs`}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-400 transition hover:border-slate-700 hover:text-white sm:flex"
            >
              <Server size={14} />
              API Docs
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        {/* HERO */}

        <section className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/5 px-3 py-1.5 text-xs text-blue-300">
            <Sparkles size={13} />
            AI-powered dataset analysis
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Give your dataset a
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              doctor's checkup.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Upload your dataset and let Dataset Doctor inspect data
            quality, schema, statistics, outliers, imbalance and
            machine-learning readiness.
          </p>
        </section>

        {/* UPLOAD */}

        <section className="mx-auto mt-10 max-w-3xl">
          <div className="glass rounded-3xl p-4 shadow-2xl shadow-black/20 sm:p-6">
            {!file ? (
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`file-drop cursor-pointer rounded-2xl border border-dashed p-10 text-center sm:p-14 ${
                  dragging
                    ? "dragging border-blue-400"
                    : "border-slate-700"
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={handleFileInput}
                  className="hidden"
                />

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <Upload size={28} />
                </div>

                <h2 className="mt-5 text-lg font-semibold text-white">
                  Drop your dataset here
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  or click to browse from your computer
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {["CSV", "XLSX", "XLS", "JSON"].map((type) => (
                    <span
                      key={type}
                      className="rounded-md border border-slate-800 bg-slate-900/70 px-2.5 py-1 text-[11px] text-slate-500"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/5 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <FileIcon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">
                      {file.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatBytes(file.size)}
                    </p>
                  </div>

                  {!loading && (
                    <button
                      onClick={removeFile}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {loading && (
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-slate-500">
                        Analyzing dataset...
                      </span>

                      <span className="text-blue-400">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="progress-shimmer h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {!loading && (
                  <button
                    onClick={diagnoseDataset}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 active:scale-[0.99]"
                  >
                    <HeartPulse size={18} />
                    Diagnose Dataset
                    <ChevronRight size={17} />
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>{error}</span>
              </div>
            )}
          </div>
        </section>

        {/* PIPELINE */}

        {!result && (
          <section className="mx-auto mt-12 max-w-5xl">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ["01", "Profile", Database],
                ["02", "Quality", ShieldCheck],
                ["03", "Statistics", BarChart3],
                ["04", "RAG", Sparkles],
                ["05", "Diagnosis", Stethoscope],
              ].map(([number, label, Icon], index) => (
                <div
                  key={label}
                  className="glass rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest text-slate-600">
                      {number}
                    </span>

                    <Icon
                      size={15}
                      className="text-blue-400"
                    />
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-300">
                    {label}
                  </p>

                  {index < 4 && (
                    <div className="mt-3 hidden h-px bg-slate-800 lg:block" />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RESULT */}

        {result && (
          <section className="mt-14">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-400">
                  <Check size={14} />
                  Analysis complete
                </div>

                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Dataset Doctor's Report
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Diagnosis generated for{" "}
                  <span className="text-slate-300">
                    {file?.name}
                  </span>
                </p>
              </div>

              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-400 transition hover:border-slate-700 hover:text-white"
              >
                <RefreshCw size={16} />
                Analyze another
              </button>
            </div>

            <ReportView
              report={doctorReport}
              plotFiles={plotFiles}
            />

            {reportPath && (
              <div className="glass mt-6 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <FileText size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      Full report generated
                    </p>

                    <p className="mt-1 max-w-xl truncate text-xs text-slate-500">
                      {reportPath}
                    </p>
                  </div>
                </div>

                <a
                  href={getReportUrl(reportPath)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-blue-400/30 hover:text-white"
                >
                  <Download size={15} />
                  Open Report
                </a>
              </div>
            )}
          </section>
        )}

        {/* FOOTER */}

        <footer className="mt-20 border-t border-slate-900 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-600 sm:flex-row">
            <div className="flex items-center gap-2">
              <Zap size={13} className="text-blue-500" />
              Dataset Doctor
            </div>

            <div>
              AI-assisted dataset profiling & diagnosis
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function getReportUrl(path) {
  if (!path) return "#";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${API_URL}${path}`;
  }

  return `${API_URL}/${path.replaceAll("\\", "/")}`;
}

export default App;