
const locales = {'en': 'en', 'es': 'es'};
let translations = {};

export default key => {
  var arr = key.split(".");
  var t = translations;
  for (var i = 0; i < arr.length; i++) t = t[arr[i]];

  if (t) {
    return t;
  } else {  
    console.warn(`${key} language key not set`);
    return key;
  }
};

export const loadTranslations = () => {
  try {
    const locale = localStorage.getItem('locale') || navigator.language;
    localStorage.setItem('locale', locale);
    const lang = locales[locale.split('-')[0]] || 'en';
    return fetchTranslations(lang)
  } catch (err) {
    return fetchTranslations('en');
  }
};

const fetchTranslations = locale => fetch(`/translations/${locale}.json`)
  .then(res => res.json())
  .then(json => translations = json);
