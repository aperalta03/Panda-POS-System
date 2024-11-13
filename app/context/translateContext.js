import React, { createContext, useState } from "react";

export const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [translations, setTranslations] = useState({});
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // Use environment variable

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

      // Map original texts to their translations
      const newTranslations = {};
      texts.forEach((text, index) => {
        newTranslations[text] = translatedTexts[index];
      });

      setTranslations(newTranslations);
    } catch (error) {
      console.error("Error translating text:", error);
    }
  };

  return (
    <TranslationContext.Provider value={{ translations, translateAllText }}>
      {children}
    </TranslationContext.Provider>
  );
};
