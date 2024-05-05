const baseUrl = import.meta.env.VITE_API_BASE;

const initUrl = () => `${baseUrl}/init`;
const predictionssUrl = () => `${baseUrl}/predictions`;
const autoCompleteUrl = () => `${baseUrl}/auto-complete`;

const post = (params: any) => ({
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(params),
});

export const getInitConfig = () => fetch(initUrl()).then((res) => res.json());

export const getPredictions = (params: {
  update: string;
  prompts: any;
  predictions: string[][];
}) => fetch(predictionssUrl(), post(params)).then((res) => res.json());

export const getAutoComplete =(params: {
  predictions: string[][];
}) => fetch(autoCompleteUrl(), post(params)).then((res) => res.json());
