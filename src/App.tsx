import React, { useState } from 'react';
import './App.css';

type Zwierze = 'KROLIK' | 'OWCA' | 'SWINIA' | 'KROWA' | 'KON' | 'MALY_PIES' | 'DUZY_PIES';
const wszystkieZwierza: Zwierze[] = ['KROLIK', 'OWCA', 'SWINIA', 'KROWA', 'KON', 'MALY_PIES', 'DUZY_PIES'];

const nazwa: Record<Zwierze, string> = {
  KROLIK: 'Królik',
  OWCA: 'Owca',
  SWINIA: 'Świnia',
  KROWA: 'Krowa',
  KON: 'Koń',
  MALY_PIES: 'Mały pies',
  DUZY_PIES: 'Duży pies',
};

const LIMIT_ZWIERZAT: Record<Zwierze, number> = {
  KROLIK: 60,
  OWCA: 24,
  SWINIA: 20,
  KROWA: 12,
  KON: 6,
  MALY_PIES: 4,
  DUZY_PIES: 2,
};

function losujZwierze(): Zwierze | 'LIS' | 'WILK' {
  const rand = Math.floor(Math.random() * 11);
  if (rand <= 4) return 'KROLIK';
  if (rand === 5) return 'OWCA';
  if (rand === 6) return 'SWINIA';
  if (rand === 7) return 'KROWA';
  if (rand === 8) return 'KON';
  if (rand === 9) return 'LIS';
  return 'WILK';
}

const startFarma = (): Record<Zwierze, number> => ({
  KROLIK: 1, OWCA: 0, SWINIA: 0, KROWA: 0, KON: 0, MALY_PIES: 0, DUZY_PIES: 0,
});

const sumaWszystkichZwierzat = (gracze: Record<Zwierze, number>[], typ: Zwierze): number => {
  return gracze.reduce((sum, g) => sum + g[typ], 0);
};

const czyMoznaDodac = (gracze: Record<Zwierze, number>[], typ: Zwierze, ile: number): boolean => {
  return sumaWszystkichZwierzat(gracze, typ) + ile <= LIMIT_ZWIERZAT[typ];
};



export default function App() {
  const [liczbaGraczy, setLiczbaGraczy] = useState<number | null>(null);
  const [gracze, setGracze] = useState<Record<Zwierze, number>[]>([]);
  const [tura, setTura] = useState(0);
  const [info, setInfo] = useState<string[]>([]);
  const [konfetti, setKonfetti] = useState<JSX.Element[]>([]);

  const dodajInfo = (txt: string) => setInfo(prev => [txt, ...prev]);

  const startGry = (n: number) => {
    setLiczbaGraczy(n);
    setGracze(Array(n).fill(null).map(() => startFarma()));
  };

  const dodajZwierze = (f: Record<Zwierze, number>, typ: Zwierze, ile: number): number => {
    const faktycznieDodane = Math.min(ile, LIMIT_ZWIERZAT[typ] - sumaWszystkichZwierzat(gracze, typ));
    if (faktycznieDodane > 0) {
      f[typ] += faktycznieDodane;
    }
    return faktycznieDodane;
  };

const [zmiany, setZmiany] = useState<Partial<Record<Zwierze, number>>>({});
const [czyZablokowane, setCzyZablokowane] = useState(false);
const [wygrany, setWygrany] = useState<number | null>(null);

const sprawdzWygrana = (gracze: Record<Zwierze, number>[]) => {
  for (let i = 0; i < gracze.length; i++) {
    const f = gracze[i];
    if (f.KROLIK > 0 && f.OWCA > 0 && f.SWINIA > 0 && f.KROWA > 0 && f.KON > 0) {
      const noweKonfetti = Array.from({ length: 300 }, (_, i) => (
        <div
          key={i}
          className="confetti"
          style={{  
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`
          }}
        />
      ));
      setKonfetti(noweKonfetti);
      setWygrany(i + 1);
      setCzyZablokowane(true);
      break;
    }
  }
};


const restartGry = () => {
  setLiczbaGraczy(null);
  setGracze([]);
  setTura(0);
  setInfo([]);
  setZmiany({});
  setCzyZablokowane(false);
  setWygrany(null);
};

const rzutKoscmi = () => {
  if (czyZablokowane) return;
  setCzyZablokowane(true);

  const k1 = losujZwierze();
  const k2 = losujZwierze();
  dodajInfo(`Gracz ${tura + 1}: 🎲 Wypadło: ${k1} i ${k2}`);
  const nowaFarma = { ...gracze[tura] };
  const zmianyTury: Partial<Record<Zwierze, number>> = {};

  if (k1 === 'LIS' || k2 === 'LIS') {
    if (nowaFarma.MALY_PIES > 0) {
      nowaFarma.MALY_PIES--;
      zmianyTury.MALY_PIES = -1;
      dodajInfo("🦊 Mały pies ochronił króliki!");
    } else {
      zmianyTury.KROLIK = 1 - nowaFarma.KROLIK;
      nowaFarma.KROLIK = 1;
      dodajInfo("🦊 Lis pożarł króliki!");
    }
  }

  if (k1 === 'WILK' || k2 === 'WILK') {
    if (nowaFarma.DUZY_PIES > 0) {
      nowaFarma.DUZY_PIES--;
      zmianyTury.DUZY_PIES = -1;
      dodajInfo("🐺 Duży pies ochronił gospodarstwo!");
    } else {
      zmianyTury.OWCA = -nowaFarma.OWCA;
      zmianyTury.SWINIA = -nowaFarma.SWINIA;
      zmianyTury.KROWA = -nowaFarma.KROWA;
      nowaFarma.OWCA = 0;
      nowaFarma.SWINIA = 0;
      nowaFarma.KROWA = 0;
      dodajInfo("🐺 Wilk zaatakował – straciłeś stado!");
    }
  }

  if (k1 === k2 && k1 !== 'LIS' && k1 !== 'WILK') {
    const ileDodano = dodajZwierze(nowaFarma, k1, 1);
    if (ileDodano > 0) {
      zmianyTury[k1] = (zmianyTury[k1] || 0) + ileDodano;
      dodajInfo(`🎉 Nowe zwierzę: ${nazwa[k1]}`);
    }
  }

  for (const z of ['KROLIK', 'OWCA', 'SWINIA'] as Zwierze[]) {
    if (k1 === z || k2 === z) {
      const pary = Math.floor(nowaFarma[z] / 2);
      const ileDodano = dodajZwierze(nowaFarma, z, pary);
      if (ileDodano > 0) {
        zmianyTury[z] = (zmianyTury[z] || 0) + ileDodano;
        dodajInfo(`${nazwa[z]} rozmnożyły się! +${ileDodano}`);
      }
    }
  }

  const nowiGracze = [...gracze];
  nowiGracze[tura] = nowaFarma;
  setGracze(nowiGracze);
  setZmiany(zmianyTury);
  sprawdzWygrana(nowiGracze);

  setTimeout(() => {
    setZmiany({});
    setTura((tura + 1) % gracze.length);
    setCzyZablokowane(false);
  }, 1000);
};

  const wymiany = [
    { koszt: { KROLIK: 6 }, zysk: { OWCA: 1 }, opis: '6 królików na owcę' },
    { koszt: { OWCA: 2 }, zysk: { SWINIA: 1 }, opis: '2 owce na świnię' },
    { koszt: { SWINIA: 3 }, zysk: { KROWA: 1 }, opis: '3 świnie na krowę' },
    { koszt: { KROWA: 2 }, zysk: { KON: 1 }, opis: '2 krowy na konia' },
    { koszt: { OWCA: 1 }, zysk: { MALY_PIES: 1 }, opis: '1 owca na małego psa' },
    { koszt: { KROWA: 1 }, zysk: { DUZY_PIES: 1 }, opis: '1 krowa na dużego psa' },
    { koszt: { OWCA: 1 }, zysk: { KROLIK: 6 }, opis: 'owcę na 6 królików' },
    { koszt: { SWINIA: 1 }, zysk: { OWCA: 2 }, opis: 'świnię na 2 owce' },
    { koszt: { KROWA: 1 }, zysk: { SWINIA: 3 }, opis: 'krowę na 3 świnie' },
    { koszt: { KON: 1 }, zysk: { KROWA: 2 }, opis: 'konia na 2 krowy' },
  ];

  const mozeWymienic = (f: Record<Zwierze, number>, koszt: Partial<Record<Zwierze, number>>, zysk: Partial<Record<Zwierze, number>>) => {
    const maWystarczajaco = Object.entries(koszt).every(([z, ile]) => f[z as Zwierze] >= ile!);
    const miesciSieWLimicie = Object.entries(zysk).every(([z, ile]) => czyMoznaDodac(gracze, z as Zwierze, ile!));
    return maWystarczajaco && miesciSieWLimicie;
  };

  const wykonajWymiane = (koszt: Partial<Record<Zwierze, number>>, zysk: Partial<Record<Zwierze, number>>, opis: string) => {
    const f = { ...gracze[tura] };
    if (!mozeWymienic(f, koszt, zysk)) return;
    Object.entries(koszt).forEach(([z, ile]) => f[z as Zwierze] -= ile!);
    Object.entries(zysk).forEach(([z, ile]) => dodajZwierze(f, z as Zwierze, ile!));
    dodajInfo(`🔁 Wymieniono: ${opis}`);
    const nowiGracze = [...gracze];
    nowiGracze[tura] = f;
    setGracze(nowiGracze);
  };

  if (liczbaGraczy === null) {
    return (
      <div className="app">
        <div className="start-screen">
          <h1 className="title">
            <div className="box">
            🐮 SuperFarmer
            </div>
          </h1>
          <p className="start-text">
            <div className="box">
            Wybierz liczbę graczy:
            </div>
          </p>
          <div className="button-group">
            {[2, 3, 4].map(n => (
              <button key={n} onClick={() => startGry(n)}>{n} graczy</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const farma = gracze[tura];

  return (
  <div className="app">
    <h2 className="round">
      <div className="box">🎯 Tura gracza {tura + 1}</div> 
    </h2>

    <div className="main-layout">
      <div className="exchange">
        <h3>
          <div className="box">Możliwe wymiany:</div>
        </h3>
        <ul>
          {wymiany.map((w, i) =>
            mozeWymienic(farma, w.koszt, w.zysk) && (
              <li key={i}>
                <span>
                  <div className="box">{w.opis}</div>
                </span>
                <button onClick={() => wykonajWymiane(w.koszt, w.zysk, w.opis)} disabled={czyZablokowane || !!wygrany}>Wybierz</button>
              </li>
            )
          )}
        </ul>
      </div>

      <div>
        <div className="farm">
          {wszystkieZwierza.map(z => (
            <div key={z} className="box">
              {nazwa[z]}: {farma[z]}{' '}
              {zmiany[z] ? (
            <span style={{ color: zmiany[z]! > 0 ? 'lime' : 'red' }}>
              ({zmiany[z]! > 0 ? '+' : ''}{zmiany[z]})
            </span>
            ) : null}
            </div>
            ))}
        </div>


        <button className="main-button" onClick={rzutKoscmi} disabled={czyZablokowane || !!wygrany} >Rzuć kośćmi 🎲</button>
        
        {wygrany && (
          <>
          <div className="box" style={{ fontSize: '2rem', margin: '1rem auto', color: 'gold', backgroundColor: 'black' }}>
            🏆 Gracz {wygrany} wygrał grę!
            <>
            {konfetti}
            </>
          </div>
          < button className="main-button" onClick={restartGry}>Zagraj ponownie! 🔁</button>
            </>
          )}
      </div>

      <div className="log">
        <h3>📜 Dziennik</h3>
        <ul>
          {info.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
}
