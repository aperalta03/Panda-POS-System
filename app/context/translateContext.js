import React, { createContext, useState, useContext } from "react";

export const TranslationContext = createContext({
  currentLanguage: "en",
  translations: {},
  translateAllText: async () => {},
});

/**
 * Provides translation functionality and context to its children components.
 *
 * This component maintains the current language and a set of translations for the application.
 * It uses the Google Translate API to convert text and updates the translations state with the results.
 *
 * @method translateAllText - Translates an array of texts into the target language using Google Translate API.
 * @param {Object} children - The child components that will be wrapped by this provider.
 * @returns {JSX.Element} A provider component that supplies translation context to its children.
 * @throws Will throw an error if the translation API call fails.
 *
 * @author Brandon Batac
 */
export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [translations, setTranslations] = useState({});
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  /**
   * Translates an array of text strings into a specified target language using the Google Translate API.
   *
   * The function sends a POST request to the Google Translate API with the provided text array and target language.
   * It processes the API response to extract the translated texts and updates the translations state accordingly.
   *
   * @async
   * @function translateAllText
   * @param {Array<string>} texts - An array of text strings to be translated.
   * @param {string} targetLanguage - The language code of the target language for translation (e.g., 'es' for Spanish).
   * @returns {Promise<void>} A promise that resolves when the translation process is complete.
   * @throws Will log an error to the console if the translation API call fails.
   *
   * @author Brandon Batac
   */
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

/**
 * A hook to access the translation context.
 *
 * @returns The translation context value.
 *
 * @throws {Error} If `useTranslate` is called outside of a `TranslationProvider`.
 *
 * @author Brandon Batac
 */
export const useTranslate = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslate must be used within a TranslationProvider.");
  }
  return context;
};
