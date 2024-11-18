import React, { createContext, useState, useContext } from "react";

export const TranslationContext = createContext({
  currentLanguage: "en",
  translations: {},
  translateAllText: async () => {},
});

export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [translations, setTranslations] = useState({});
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const translateAllText = async (texts, targetLanguage) => {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: texts,
            target: targetLanguage,
          }),
        }
      );

      const data = await response.json();
      const translatedTexts = data.data.translations.map(
        (translation) => translation.translatedText
      );

      const newTranslations = {};
      texts.forEach((text, index) => {
        newTranslations[text] = translatedTexts[index];
      });

      setTranslations((prev) => ({ ...prev, ...newTranslations }));
    } catch (error) {
      console.error("Error translating text:", error);
    }
  };

  return (
    <TranslationContext.Provider
      value={{
        currentLanguage,
        setCurrentLanguage,
        translations,
        translateAllText,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslate = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslate must be used within a TranslationProvider.");
  }
  return context;
};
