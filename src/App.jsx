import { useEffect, useMemo, useState } from 'react';

const MAX_SUBJECTS = 15;
const THEME_STORAGE_KEY = 'gwacalc-theme';

const createSubjects = (count) =>
  Array.from({ length: count }, (_, index) => ({
    id: `${Date.now()}-${index}`,
    name: '',
    units: '',
    grade: '',
  }));

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button className="theme-toggle" type="button" onClick={onToggle} aria-label="Toggle dark mode">
      <span className="theme-icon" aria-hidden="true">{isDark ? '☀' : '☾'}</span>
      <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
}

function StepCount({ value, error, onChange, onNext }) {
  return (
    <section className="card step-card slide-in" aria-labelledby="step-count-title">
      <div className="step-badge">01</div>
      <div className="card-content">
        <p className="eyebrow">Getting started</p>
        <h2 id="step-count-title">How many subjects are you taking?</h2>
        <p className="helper-text">We&apos;ll create a row for each course so you can enter your grades and units.</p>
        <form onSubmit={onNext} noValidate>
          <label className="field-label" htmlFor="subject-count">Number of subjects</label>
          <input
            id="subject-count"
            className={`large-input ${error ? 'input-error' : ''}`}
            type="number"
            min="1"
            max={MAX_SUBJECTS}
            step="1"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="e.g. 6"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'count-error' : undefined}
            autoFocus
          />
          {error && <p className="error-message" id="count-error">{error}</p>}
          <button className="primary-button" type="submit">Continue <span aria-hidden="true">→</span></button>
        </form>
      </div>
    </section>
  );
}

function SubjectRow({ subject, index, errors, onChange }) {
  return (
    <div className="subject-row" style={{ '--row-delay': `${index * 70}ms` }}>
      <div className="row-number">{String(index + 1).padStart(2, '0')}</div>
      <div className="subject-field">
        <label htmlFor={`course-${subject.id}`}>Course name</label>
        <input
          id={`course-${subject.id}`}
          type="text"
          value={subject.name}
          onChange={(event) => onChange(subject.id, 'name', event.target.value)}
          placeholder="e.g. Mathematics"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>
      <div className="subject-field compact-field">
        <label htmlFor={`units-${subject.id}`}>Units</label>
        <input
          id={`units-${subject.id}`}
          type="number"
          min="0.5"
          step="0.5"
          value={subject.units}
          onChange={(event) => onChange(subject.id, 'units', event.target.value)}
          placeholder="3"
          aria-invalid={Boolean(errors.units)}
        />
        {errors.units && <span className="field-error">{errors.units}</span>}
      </div>
      <div className="subject-field compact-field">
        <label htmlFor={`grade-${subject.id}`}>Grade</label>
        <input
          id={`grade-${subject.id}`}
          type="number"
          min="0"
          max="5"
          step="0.01"
          value={subject.grade}
          onChange={(event) => onChange(subject.id, 'grade', event.target.value)}
          placeholder="1.75"
          aria-invalid={Boolean(errors.grade)}
        />
        {errors.grade && <span className="field-error">{errors.grade}</span>}
      </div>
    </div>
  );
}

function SubjectForm({ subjects, errors, onChange, onSubmit, onBack }) {
  return (
    <section className="card form-card slide-in" aria-labelledby="subjects-title">
      <div className="form-header">
        <div>
          <p className="eyebrow">Step 02 / Enter details</p>
          <h2 id="subjects-title">Your subjects</h2>
          <p className="helper-text">Add the course name, unit count, and final grade for each subject.</p>
        </div>
        <div className="count-pill">{subjects.length} {subjects.length === 1 ? 'course' : 'courses'}</div>
      </div>
      <div className="subject-header" aria-hidden="true">
        <span />
        <span>Course</span>
        <span>Units</span>
        <span>Grade</span>
      </div>
      <form onSubmit={onSubmit} noValidate>
        <div className="subject-list">
          {subjects.map((subject, index) => (
            <SubjectRow
              key={subject.id}
              subject={subject}
              index={index}
              errors={errors[index] || {}}
              onChange={onChange}
            />
          ))}
        </div>
        {errors.form && <p className="error-message form-error">{errors.form}</p>}
        <div className="form-actions">
          <button className="secondary-button" type="button" onClick={onBack}>← Change count</button>
          <button className="primary-button" type="submit">Calculate GWA <span aria-hidden="true">→</span></button>
        </div>
      </form>
    </section>
  );
}

function Result({ result, onReset }) {
  const [displayGwa, setDisplayGwa] = useState(0);

  useEffect(() => {
    const duration = 850;
    const start = performance.now();
    let frameId;
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - ((1 - progress) ** 3);
      setDisplayGwa(result.gwa * eased);
      if (progress < 1) frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [result.gwa]);

  return (
    <section className="card result-card slide-in" aria-labelledby="result-title">
      <div className="result-topline"><span className="result-check">✓</span> Calculation complete</div>
      <p className="eyebrow">Your term average</p>
      <h2 id="result-title">General Weighted Average</h2>
      <div className="gwa-value" aria-label={`Your GWA is ${result.gwa.toFixed(2)}`}>{displayGwa.toFixed(2)}</div>
      <p className="result-caption">Lower scores represent stronger academic performance.</p>
      <div className="breakdown">
        <div><span>Total units</span><strong>{result.totalUnits.toFixed(1)}</strong></div>
        <div><span>Total weighted points</span><strong>{result.weightedPoints.toFixed(2)}</strong></div>
      </div>
      <p className="formula">GWA = Σ(grade × units) ÷ Σ(units)</p>
      <button className="secondary-button result-reset" type="button" onClick={onReset}>↺ Calculate again</button>
    </section>
  );
}

function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) === 'dark');
  const [step, setStep] = useState(1);
  const [count, setCount] = useState('');
  const [countError, setCountError] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [transitionDirection, setTransitionDirection] = useState('forward');

  useEffect(() => {
    document.title = 'GWA Calculator';
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  const summary = useMemo(() => {
    if (!subjects.length) return { totalUnits: 0, weightedPoints: 0, gwa: 0 };
    const totalUnits = subjects.reduce((total, subject) => total + (Number(subject.units) || 0), 0);
    const weightedPoints = subjects.reduce(
      (total, subject) => total + ((Number(subject.grade) || 0) * (Number(subject.units) || 0)),
      0,
    );
    return {
      totalUnits,
      weightedPoints,
      gwa: totalUnits ? weightedPoints / totalUnits : 0,
    };
  }, [subjects]);

  const handleCountNext = (event) => {
    event.preventDefault();
    const parsedCount = Number(count);
    if (!Number.isInteger(parsedCount) || parsedCount < 1 || parsedCount > MAX_SUBJECTS) {
      setCountError(`Enter a whole number between 1 and ${MAX_SUBJECTS}.`);
      return;
    }
    setCountError('');
    setSubjects(createSubjects(parsedCount));
    setErrors({});
    setTransitionDirection('forward');
    setStep(2);
  };

  const updateSubject = (id, field, value) => {
    setSubjects((current) => current.map((subject) => (
      subject.id === id ? { ...subject, [field]: value } : subject
    )));
    setErrors((current) => {
      const next = { ...current };
      const subjectIndex = subjects.findIndex((subject) => subject.id === id);
      if (next[subjectIndex]?.[field]) {
        next[subjectIndex] = { ...next[subjectIndex], [field]: '' };
      }
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    subjects.forEach((subject, index) => {
      const rowErrors = {};
      if (!subject.name.trim()) rowErrors.name = 'Course name is required.';
      if (!subject.units || Number(subject.units) <= 0) rowErrors.units = 'Enter units above 0.';
      if (!subject.grade || Number(subject.grade) < 0 || Number(subject.grade) > 5) {
        rowErrors.grade = 'Use a grade from 0 to 5.';
      }
      if (Object.keys(rowErrors).length) nextErrors[index] = rowErrors;
    });
    if (Object.keys(nextErrors).length || summary.totalUnits <= 0) {
      nextErrors.form = 'Please complete every field before calculating.';
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setResult(summary);
    setTransitionDirection('forward');
    setStep(3);
  };

  const reset = () => {
    setStep(1);
    setCount('');
    setCountError('');
    setSubjects([]);
    setErrors({});
    setResult(null);
    setTransitionDirection('backward');
  };

  return (
    <div className={`app-shell step-${step} direction-${transitionDirection} ${isDark ? 'dark-theme' : ''}`}>
      <header className="topbar">
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); reset(); }}>
          <span className="brand-mark">∑</span>
          <span>GWA<span className="brand-accent">Calculator</span></span>
        </a>
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark((current) => !current)} />
      </header>
      <main className="main-content">
        <div className="intro">
          <p className="eyebrow accent-eyebrow">Academic toolkit</p>
          <h1>Calculate your <em>GWA</em></h1>
          <p className="intro-copy">A clear, simple way to track your weighted average for the term.</p>
        </div>
        <div className="progress" aria-label={`Step ${step} of 3`}>
          <span className={step >= 1 ? 'active' : ''}>01 <b>Count</b></span>
          <i className={step >= 2 ? 'active' : ''} />
          <span className={step >= 2 ? 'active' : ''}>02 <b>Details</b></span>
          <i className={step >= 3 ? 'active' : ''} />
          <span className={step >= 3 ? 'active' : ''}>03 <b>Result</b></span>
        </div>
        {step === 1 && <StepCount value={count} error={countError} onChange={setCount} onNext={handleCountNext} />}
        {step === 2 && (
          <SubjectForm
            subjects={subjects}
            errors={errors}
            onChange={updateSubject}
            onSubmit={handleSubmit}
            onBack={() => {
              setTransitionDirection('backward');
              setStep(1);
              setErrors({});
            }}
          />
        )}
        {step === 3 && result && <Result result={result} onReset={reset} />}
        <p className="privacy-note"><span aria-hidden="true"></span> Your data stays in this browser and is never saved.</p>
      </main>
      <footer>Built for better study planning <span>•</span> GWA = General Weighted Average <span>•</span> Created by shunreiii</footer>
    </div>
  );
}

export default App;