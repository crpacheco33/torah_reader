'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [torahText, setTorahText] = useState<any[]>([]);
  const [chapterCount, setChapterCount] = useState(0);

  const books = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'
  ];

  useEffect(() => {
    if (selectedBook) {
      // Set chapter count based on selected book
      const counts = {
        'Genesis': 50,
        'Exodus': 40,
        'Leviticus': 27,
        'Numbers': 36,
        'Deuteronomy': 34
      };
      setChapterCount(counts[selectedBook as keyof typeof counts]);
    }
  }, [selectedBook]);

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBook(e.target.value);
    setSelectedChapter('');
    setTorahText([]);
  };

  const handleChapterChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChapter(e.target.value);
    try {
      const response = await fetch(`https://www.sefaria.org/api/texts/${selectedBook}.${e.target.value}?commentary=0&context=0`);
      const data = await response.json();
      setTorahText(data.he.map((hebrew: string, index: number) => ({
        hebrew,
        english: data.text[index]
      })));
    } catch (error) {
      console.error('Error fetching Torah text:', error);
    }
  };

  const cleanText = (text: string) => {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/&thinsp;/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/[{}]/g, '')
      .replace(/\\n/g, ' ');
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-blue-300 to-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-10 text-blue-900 drop-shadow-md">
          Torah Reader
        </h1>
        
        <div className="flex gap-6 mb-10">
          <div className="flex-1">
            <label htmlFor="book" className="block text-blue-900 font-semibold mb-2 text-lg">
              Select Book
            </label>
            <select
              id="book"
              value={selectedBook}
              onChange={handleBookChange}
              className="w-full p-3 border-2 border-blue-200 rounded-lg text-gray-900 bg-white text-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="">Choose a Book</option>
              {books.map((book) => (
                <option key={book} value={book}>
                  {book}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="chapter" className="block text-blue-900 font-semibold mb-2 text-lg">
              Select Chapter
            </label>
            <select
              id="chapter"
              value={selectedChapter}
              onChange={handleChapterChange}
              className="w-full p-3 border-2 border-blue-200 rounded-lg text-gray-900 bg-white text-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              disabled={!selectedBook}
            >
              <option value="">Choose a Chapter</option>
              {[...Array(chapterCount)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Chapter {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-8">
          {torahText.length === 0 ? (
            <div className="text-center bg-white p-8 rounded-lg shadow-lg border-2 border-blue-100">
              <p className="text-gray-800 text-xl font-medium">
                Select a book and chapter to begin reading
              </p>
            </div>
          ) : (
            torahText.map((verse, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-xl border-2 border-blue-100 hover:border-blue-300 transition-all">
                <p className="text-3xl mb-4 text-right font-hebrew leading-relaxed text-gray-900 font-bold" dir="rtl">
                  {cleanText(verse.hebrew)}
                </p>
                <p className="text-gray-800 text-xl leading-relaxed">
                  {cleanText(verse.english)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
