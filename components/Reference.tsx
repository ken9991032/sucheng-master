import React, { useState } from 'react';
import { ROOT_DATA, WORD_DATA } from '../data';
import { PixelButton, PixelCard } from './PixelComponents';

interface ReferenceProps {
  onBack: () => void;
}

const Reference: React.FC<ReferenceProps> = ({ onBack }) => {
  const [tab, setTab] = useState<'roots' | 'words' | 'tips'>('roots');
  const [filter, setFilter] = useState('');

  const filteredWords = WORD_DATA.filter(w => 
    w.char.includes(filter) || 
    w.code.toLowerCase().includes(filter.toLowerCase()) ||
    w.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col p-4 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400 pixel-shadow-sm" style={{textShadow: '2px 2px #000'}}>
          速成寶典
        </h1>
        <PixelButton onClick={onBack} color="secondary" className="px-4 py-2 text-sm">
          返回
        </PixelButton>
      </div>

      <div className="flex gap-2 mb-4">
        <PixelButton 
          onClick={() => setTab('roots')} 
          color={tab === 'roots' ? 'accent' : 'secondary'}
          className="flex-1 py-2 text-sm"
        >
          字根表
        </PixelButton>
        <PixelButton 
          onClick={() => setTab('words')} 
          color={tab === 'words' ? 'accent' : 'secondary'}
          className="flex-1 py-2 text-sm"
        >
          常用字表
        </PixelButton>
        <PixelButton 
          onClick={() => setTab('tips')} 
          color={tab === 'tips' ? 'accent' : 'secondary'}
          className="flex-1 py-2 text-sm"
        >
          輸入技巧
        </PixelButton>
      </div>

      <PixelCard className="flex-1 overflow-hidden flex flex-col min-h-0 bg-[#f4f4f4]">
        {tab === 'roots' && (
          <div className="overflow-y-auto h-full pr-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ROOT_DATA.map((item) => (
                <div key={item.key} className="border-2 border-black p-3 bg-white flex justify-between items-center hover:bg-yellow-100">
                  <span className="text-2xl font-bold text-blue-600">{item.key}</span>
                  <span className="text-2xl text-black">{item.root}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'words' && (
          <div className="flex flex-col h-full">
            <input 
              type="text" 
              placeholder="搜尋 (例如：'我' 或 'HI')"
              className="w-full p-2 border-2 border-black mb-4 font-sans text-black"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <div className="overflow-y-auto flex-1 pr-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-2">字</th>
                    <th className="p-2">碼</th>
                    <th className="p-2">拆解</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWords.map((word, idx) => (
                    <tr key={idx} className="border-b border-gray-300 hover:bg-yellow-100 text-black">
                      <td className="p-2 text-xl">{word.char}</td>
                      <td className="p-2 font-mono font-bold text-blue-800">{word.code}</td>
                      <td className="p-2 text-gray-600">{word.hint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'tips' && (
          <div className="overflow-y-auto h-full pr-2 text-black space-y-6">
            <section>
              <h3 className="text-xl font-bold mb-2 border-b-2 border-black pb-1">1. 基本原理</h3>
              <p>速成輸入法取倉頡碼的 <strong className="text-red-600">「頭碼」（第一碼）</strong> 和 <strong className="text-red-600">「尾碼」（最後一碼）</strong>。</p>
              <p className="mt-2 text-sm text-gray-700">例如：我 = H (竹) + I (戈)</p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-2 border-b-2 border-black pb-1">2. 選字技巧</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>重碼字非常多。</li>
                <li>輸入完兩碼後，按 <kbd className="border border-black px-1 rounded bg-gray-200">Space</kbd> 開啟選字清單。</li>
                <li>使用 <kbd>Page Up/Down</kbd> 或 <kbd>[</kbd> <kbd>]</kbd> 翻頁。</li>
                <li>按數字鍵 <kbd>1-9</kbd> 選擇。</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-2 border-b-2 border-black pb-1">3. 難字拆解</h3>
              <p>有些字很難拆，通常用到 <strong className="text-red-600">X (難)</strong> 鍵。</p>
              <p className="mt-1">例：身 (HH)、齊 (YX)、龜 (NX)。</p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-2 border-b-2 border-black pb-1">4. 標點符號</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>， (逗號) : <span className="font-bold">ZA</span></div>
                <div>。 (句號) : <span className="font-bold">ZB</span></div>
                <div>？ (問號) : <span className="font-bold">ZI</span></div>
                <div>！ (驚嘆號) : <span className="font-bold">ZJ</span></div>
              </div>
            </section>
          </div>
        )}
      </PixelCard>
    </div>
  );
};

export default Reference;