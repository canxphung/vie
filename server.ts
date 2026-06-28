/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware for parsing JSON requests
app.use(express.json());

// Initialize Gemini client strictly adhering to systemic instructions
const apiKey = process.env.GEMINI_API_KEY || '';
const hasApiKey = apiKey && apiKey !== 'MY_GEMINI_API_KEY';

let ai: GoogleGenAI | null = null;
if (hasApiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API endpoint for AI Itinerary Optimization
app.post('/api/ai/itinerary', async (req, res) => {
  try {
    const { prompt, province, budget, language } = req.body;
    
    if (!hasApiKey || !ai) {
      // Fallback with beautiful pre-baked response if key is not configured yet
      return res.json({
        success: true,
        source: 'local_optimized',
        data: getFallbackItinerary(province || 'quang-nam', budget || 3000000, language || 'vi')
      });
    }

    const sysInstruction = `
      You are absolute premium concierge travel expert for Central Vietnam (Quảng Nam/Hội An, Đà Nẵng, Thừa Thiên Huế).
      Your goal is to build an outstanding, hyper-localized personalized travel combo itinerary, completely optimizing routes and cost.
      Output strictly valid JSON according to the responseSchema provided. No markdown text formatting, only the raw JSON.
      Respond in the target language requested (either Vietnamese or English).
    `;

    const userPrompt = `
      Generate a travel plan for Central Vietnam with parameters:
      - Province/City of focus: ${province}
      - Target budget limit: ${budget} VND
      - Special custom requests/vibe: ${prompt || 'No details'}
      - Preferred language: ${language === 'vi' ? 'Vietnamese' : 'English'}
      
      Suggest specific local attractions, hotels, activities, and motorbike/car rentals that are popular there. Ensure total budget calculations remain highly realistic and optimized.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: sysInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['itineraryTitle', 'estimatedSavingsPercent', 'totalCostEstimate', 'days', 'savingTips'],
          properties: {
            itineraryTitle: {
              type: Type.STRING,
              description: 'Ex: Hành trình 3 ngày 2 đêm khám phá Hội An thanh tịnh'
            },
            estimatedSavingsPercent: {
              type: Type.INTEGER,
              description: 'Percentage saved by buying as a companion combo (e.g., 20)'
            },
            totalCostEstimate: {
              type: Type.INTEGER,
              description: 'Optimized total cost in VND for the whole duration.'
            },
            days: {
              type: Type.ARRAY,
              description: 'Daily schedules',
              items: {
                type: Type.OBJECT,
                required: ['dayNumber', 'title', 'activities'],
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ['time', 'attractionName', 'description', 'costVND'],
                      properties: {
                        time: { type: Type.STRING, description: 'Ex: 08:30' },
                        attractionName: { type: Type.STRING },
                        description: { type: Type.STRING },
                        costVND: { type: Type.INTEGER }
                      }
                    }
                  }
                }
              }
            },
            savingTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Top local hacks to save money, commute better or dodge crowds.'
            }
          }
        }
      }
    });

    const textOutput = response.text || '';
    const parsedData = JSON.parse(textOutput.trim());

    return res.json({
      success: true,
      source: 'gemini_optimizer',
      data: parsedData
    });

  } catch (error: unknown) {
    console.error('Error with AI Itinerary generation:', error);
    const message = error instanceof Error ? error.message : 'Server Internal Error';
    return res.status(500).json({
      success: false,
      message,
      fallback: getFallbackItinerary('quang-nam', 3000000, req.body.language || 'vi')
    });
  }
});

// Seeded local fallback travel itineraries for gorgeous high-speed preview
function getFallbackItinerary(province: string, budget: number, lang: string) {
  const isVi = lang === 'vi';
  if (province === 'da-nang') {
    return {
      itineraryTitle: isVi ? 'Hành trình Đà Nẵng Năng Động và Biển Mỹ Khê (3N2Đ)' : 'Dynamic Danang & My Khe Beach Itinerary (3D2N)',
      estimatedSavingsPercent: 18,
      totalCostEstimate: Math.min(budget, 3200000),
      days: [
        {
          dayNumber: 1,
          title: isVi ? 'Khám phá bán đảo Sơn Trà & Chùa Linh Ứng' : 'Explore Son Tra Peninsula & Linh Ung Pagoda',
          activities: [
            { time: '09:00', attractionName: isVi ? 'Viếng Chùa Linh Ứng' : 'Linh Ung Pagoda Scenic Visit', description: isVi ? 'Ngắm Phật Bà Quan Âm cao nhất Việt Nam, nhìn trọn cảnh biển đảo bao la.' : 'Behold the tallest Lady Buddha Statue looking over the turquoise bay.', costVND: 0 },
            { time: '12:00', attractionName: isVi ? 'Ẩm thực bánh tráng thịt heo Hai Bà' : 'Pork Roll Wrap Local Tasting', description: isVi ? 'Thưởng thức bánh tráng cuốn thịt heo hai đầu da trứ danh thơm ngon đậm đà.' : 'Roll authentic local tender pork with rich anchovy dipping sauce.', costVND: 120000 },
            { time: '15:30', attractionName: isVi ? 'Tắm biển Mỹ Khê cát mịn' : 'My Khe Beach Relaxation', description: isVi ? 'Đắm mình vào dải nước ngọc lơ lửng mát mẻ xả mọi mệt nhọc dạt bèo.' : 'Plunge into one of Forbes top rated pristine beaches under golden sunset.', costVND: 30000 },
            { time: '19:30', attractionName: isVi ? 'Ngắm Cầu Rồng phun lửa rực sáng' : 'Dragon Bridge Fire Show Walkway', description: isVi ? 'Thưởng lãm màn trình diễn Cầu Rồng thổi bùng lửa và nước hùng vĩ phi thường.' : 'Take pictures of dragons breathing fire and smoke over Han river lights.', costVND: 70000 }
          ]
        },
        {
          dayNumber: 2,
          title: isVi ? 'Chinh phục Bà Nà Hills & Quần thể Cầu Vàng' : 'Conquer Bana Hills Magic & the Golden Bridge',
          activities: [
            { time: '08:00', attractionName: isVi ? 'Lướt cáp treo tiên cảnh Sun World' : 'Record-Breaking Sun World Cableway', description: isVi ? 'Đi cáp treo leo qua vách đá sương mờ dốc dựng rợp bóng hoa dại dã quỳ.' : 'Soar above foggy mist valleys with spectacular direct prime jungle views.', costVND: 900000 },
            { time: '10:30', attractionName: isVi ? 'Tạo hình cùng Cầu Vàng' : 'Insta Golden Bridge Walkway', description: isVi ? 'Cảm nhận đôi bàn tay đá khổng lồ mọc rêu xanh bưng dải Cầu vàng trên chín tầng mây.' : 'Conquer the world icon, snapping photos of moss-kissed stone hands in the sky.', costVND: 0 },
            { time: '12:30', attractionName: isVi ? 'Buffet ẩm thực Làng Pháp cổ kính' : 'Grand Buffet French Village Banquet', description: isVi ? 'Nghỉ trưa dùng bữa trưa buffet phong phú Âu Á đẳng cấp sầm uất.' : 'A diverse Asian-European fusion cuisine under gothic cathedral arches.', costVND: 350000 }
          ]
        }
      ],
      savingTips: [
        isVi ? 'Hãy thuê xe máy tự lái tại VietCharm chỉ 150k/ngày để tha hồ lượn phố biển vi vu tự do.' : 'Rent a motorbike with smart keys on VietCharm for just $6/day for supreme cost saving.',
        isVi ? 'Xem Cầu Rồng trình diễn lửa nước vào các ngày thứ Sáu, thứ Bảy và Chủ Nhật lúc 21:00 tối.' : 'Catch the fire-breathing Dragon Bridge show exclusively at 9:00 PM Fri-Sun.',
        isVi ? 'Mua vé cáp treo Bà Nà theo combo VietCharm để nhận giảm thẳng 10% chi phí ăn uống buffet kèm.' : 'Buy Ba Na cable tickets early via VietCharm combo pack to get 10% offline discounts.'
      ]
    };
  } else if (province === 'thua-thien-hue') {
    return {
      itineraryTitle: isVi ? 'Hành trình Cố Đô Huế Cổ Kính Nhã Nhặn (2N1Đ)' : 'Imperial Hue Cultural Heritage Itinerary (2D1N)',
      estimatedSavingsPercent: 22,
      totalCostEstimate: Math.min(budget, 2400000),
      days: [
        {
          dayNumber: 1,
          title: isVi ? 'Ký ức cung đình Đại Nội & Nghe Ca Huế Sông Hương' : 'Imperial Citadel Memories & Royal River Voices',
          activities: [
            { time: '08:30', attractionName: isVi ? 'Khám phá Đại Nội Huế vĩ đại' : 'Throne Halls of Palace Citadel', description: isVi ? 'Tìm hiểu Điện Thái Hòa, Ngọ Môn và Thế Miếu cổ xưa tráng lệ trường tồn.' : 'Walk the historical corridors of Nguyen Dynasty, witnessing sacred bronze urns.', costVND: 200000 },
            { time: '12:00', attractionName: isVi ? 'Thưởng thức Cơm Hến & Bún Bò Huế gốc' : 'Authentic Hue Beef Noodles & Baby Clam Rice', description: isVi ? 'Tìm đến quán gốc hẻm xưa trải vị gia truyền cay tê nồng nàn sảng khoái.' : 'Trill your palate with sweet spicy broth of beef briskets and herbal mint.', costVND: 65000 },
            { time: '15:00', attractionName: isVi ? 'Vãng cảnh Chùa Thiên Mụ cổ kính' : 'Pagoda of Heavenly Lady', description: isVi ? 'Check-in tháp Phước Duyên soi bóng êm đềm dòng Hương thơ mộng lãng mạn.' : 'Explore 7-storey landmark tower hearing ancient echoes of brass bells.', costVND: 0 },
            { time: '19:30', attractionName: isVi ? 'Nghe ca Huế dân ca trên Thuyền Rồng' : 'Royal Dragon Boat Folk Whispers', description: isVi ? 'Thuyền rồng lướt êm sương khói, lắng nghe đàn tranh rải nhịp cổ truyền say sưa.' : 'Sail under the twinkling Trang Tien bridge, releasing candles onto the night stream.', costVND: 150000 }
          ]
        }
      ],
      savingTips: [
        isVi ? 'Hãy ghé thăm các lăng tẩm hoàng gia vào buổi chiều mát để cảm nhận sự trang nghiêm u tịch của cổ vật.' : 'Visit royal mausoleums in the cool afternoon to avoid humid heat.',
        isVi ? 'Bún bò Huế ở vỉa hè các ngõ hẻm ngã ba thường thơm ngon và rẻ bằng một nửa nhà hàng chính lộ.' : 'Side alley beef noodles taste twice as rich with absolute local prices.'
      ]
    };
  } else if (province === 'binh-dinh') {
    return {
      itineraryTitle: isVi ? 'Khám phá Kỳ Co - Eo Gió & Tháp Chăm Quy Nhơn (2N1Đ)' : 'Quy Nhon Coastal Gems: Ky Co, Eo Gio & Cham Towers (2D1N)',
      estimatedSavingsPercent: 20,
      totalCostEstimate: Math.min(budget, 2100000),
      days: [
        {
          dayNumber: 1,
          title: isVi ? 'Danh thắng Eo Gió lộng gió & Ngắm Tháp Bánh Ít' : 'Scenic Eo Gio Coastal Windy Passages & Banh It Towers',
          activities: [
            { time: '08:30', attractionName: isVi ? 'Dạo bước con đường ven biển Eo Gió' : 'Eo Gio Seaside Clifftop Walk', description: isVi ? 'Chiêm ngưỡng eo biển lộng gió đẹp nhất Quy Nhơn ôm trọn sóng biếc.' : 'Walk the photogenic fenced path winding around gorgeous oceanic rocky cliffs.', costVND: 25000 },
            { time: '11:30', attractionName: isVi ? 'Trải nghiệm Bún Chả Cá Quy Nhơn' : 'Quy Nhon Fish-cake Rice Noodles', description: isVi ? 'Thưởng thức bún chả cá thu gia truyền dai ngon đậm vị biển.' : 'Indulge in locally made fish cakes with aromatic dilly tomato soup.', costVND: 50000 },
            { time: '14:30', attractionName: isVi ? 'Khám phá quần thể Tháp Bánh Ít cổ kính' : 'Banh It Cham Ancient Towers', description: isVi ? 'Chiêm bái cụm tháp Chăm hơn 1000 năm tuổi trên đồi cao lộng gió.' : 'Climb the wind-swept hill to discover historical terracotta brick architecture.', costVND: 20000 }
          ]
        },
        {
          dayNumber: 2,
          title: isVi ? 'Cano lướt biển đảo Kỳ Co - Lặn ngắm san hô' : 'Ky Co Island Speedboat Venture & Coral Snorkeling',
          activities: [
            { time: '08:00', attractionName: isVi ? 'Cano cao tốc ra Đảo Kỳ Co' : 'High-Speed Jetboat to Ky Co Beach', description: isVi ? 'Đắm chìm vào dải cát trắng mịn màng và nước xanh màu ngọc bích.' : 'Zoom across ocean sprays to a pristine beach dubbed the Maldives of Vietnam.', costVND: 450000 },
            { time: '11:30', attractionName: isVi ? 'Lặn ngắm rạn san hô Bãi Dứa' : 'Coral Reef Snorkeling at Bai Dua', description: isVi ? 'Đeo kính lặn thám hiểm hàng trăm rạn san hô đầy màu sắc sinh động.' : 'Float with life vests observing thriving marine life in pure shallow waters.', costVND: 150000 }
          ]
        }
      ],
      savingTips: [
        isVi ? 'Nên đi Kỳ Co bằng cano vào buổi sáng sớm để tránh nắng gắt và biển động vào chiều muộn.' : 'Take the Ky Co boat tour before 9 AM to secure calm tides and avoid afternoon winds.',
        isVi ? 'Tháp Bánh Ít chụp hình rất đẹp vào lúc hoàng hôn khi những tia nắng vàng chiếu rọi viên gạch cổ.' : 'Visit Banh It towers at sunset for breathtaking golden rays hitting the red-clay bricks.'
      ]
    };
  } else if (province === 'khanh-hoa') {
    return {
      itineraryTitle: isVi ? 'Nha Trang Vịnh Biển Thiên Đường & Đảo Ngọc Hòn Tre (2N1Đ)' : 'Paradise Nha Trang Bay & Hon Tre Island Adventure (2D1N)',
      estimatedSavingsPercent: 17,
      totalCostEstimate: Math.min(budget, 2500000),
      days: [
        {
          dayNumber: 1,
          title: isVi ? 'Huyền thoại Tháp Bà Ponagar & Danh thắng Hòn Chồng' : 'Sacred Ponagar Cham Towers & Hon Chong Rock Promontory',
          activities: [
            { time: '09:00', attractionName: isVi ? 'Chiêm bái đền tháp cổ Tháp Bà Ponagar' : 'Po Nagar Cham Towers', description: isVi ? 'Tìm hiểu nguồn gốc thờ mẫu nữ thần Thiên Y Ana thiêng liêng.' : 'Observe historical architecture dating back to the 8th century on Cu Lao hill.', costVND: 30000 },
            { time: '11:30', attractionName: isVi ? 'Thưởng thức Nem nướng Nha Trang Đậm Đà' : 'Nha Trang Grilled Pork Skewers (Nem Nuong)', description: isVi ? 'Cuốn nem nướng cùng bánh tráng chiên giòn rụm và nước chấm tương đậu.' : 'Wrap crispy fried rolls, juicy pork, and mango slices dipped in rich peanut sauce.', costVND: 70000 },
            { time: '14:30', attractionName: isVi ? 'Tản bộ danh thắng đá chồng Hòn Chồng' : 'Hon Chong Rock Formations Walk', description: isVi ? 'Ngắm nhìn những khối đá xếp chồng kỳ thú vươn mình ra biển khơi.' : 'Witness majestic natural rocks piled over each other with stellar bay views.', costVND: 22000 }
          ]
        },
        {
          dayNumber: 2,
          title: isVi ? 'Vui chơi bất tận VinWonders Nha Trang' : 'All-Day Thrills at VinWonders Nha Trang',
          activities: [
            { time: '08:30', attractionName: isVi ? 'Cáp treo vượt biển hoặc tàu cao tốc' : 'Scenic Sea-Crossing Travel', description: isVi ? 'Lướt sóng vượt đại dương hướng về đảo ngọc sầm uất.' : 'Board modern transport lines crossing the crystal bay towards Hon Tre island.', costVND: 180000 },
            { time: '10:00', attractionName: isVi ? 'Công viên chủ đề VinWonders Nha Trang' : 'VinWonders Amusement Theme Park', description: isVi ? 'Thỏa sức trải nghiệm đường trượt núi Zipline, rạp phim bay, vịnh phao nổi.' : 'Unleash your energy with mega water slides, roller coasters, and dolphin shows.', costVND: 800000 }
          ]
        }
      ],
      savingTips: [
        isVi ? 'Thưởng thức hải sản dọc đường Trần Phú hoặc khu tháp bà thường tươi rói và rẻ hơn nhiều so với trung tâm thương mại.' : 'Dine on grilled clams and sea urchins near Ponagar bridge for local, honest prices.',
        isVi ? 'Đăng ký vé VinWonders kèm combo xe máy tại VietCharm để tối ưu hóa thời gian di chuyển linh hoạt.' : 'Secure your amusement park passes early in VietCharm combo bundle to save up to 15%.'
      ]
    };
  }

  // Default Quang Nam / Hoi An
  return {
    itineraryTitle: isVi ? 'Combo Hành Trình Hội An Đèn Lồng Lung Linh & Lặn Biển Cù Lao Chàm (2N1Đ)' : 'Hoi An Ancient Lanterns & Cham Island Snorkeling Combo (2D1N)',
    estimatedSavingsPercent: 15,
    totalCostEstimate: Math.min(budget, 1950000),
    days: [
      {
        dayNumber: 1,
        title: isVi ? 'Lạc lối phố cổ đèn lồng & Thuyền thả hoa đăng' : 'Lost in Lantern Streets & Mystical River Floats',
        activities: [
          { time: '14:30', attractionName: isVi ? 'Tản bộ phố cổ & Check-in Chùa Cầu' : 'Ancient Heritage Promenade & Japanese Covered Bridge', description: isVi ? 'Thu trọn nét rực rỡ của những mảng tường vàng hoa giấy thơ mộng bám phong rêu.' : 'Snap classical golden-wall photos under bougainvillea cascading in ancient wind.', costVND: 120000 },
          { time: '17:30', attractionName: isVi ? 'Dạo thuyền sông Hoài & Thả hoa đăng' : 'Rowboat Cruise & Candlelit Wishing Lanterns', description: isVi ? 'Trải vị chèo tay mộc mạc bên sông nước, lấp lánh nến ước mơ xuôi dòng.' : 'Board a tiny hand-rowed wooden boat, floating biodegradable lantern lights.', costVND: 100000 },
          { time: '19:30', attractionName: isVi ? 'Bữa tối đặc sản Cao Lầu Cao Sang' : 'Hoi An Cao Lau Culinary Heritage dinner', description: isVi ? 'Sợi mì tro giòn sật rưới thịt xá xíu đậm bản sắc Hội An mộng mơ.' : 'Chewy ash-water noodles top-loaded with savory pork, crisp fat croutons and fresh herbs.', costVND: 80000 }
        ]
      },
      {
        dayNumber: 2,
        title: isVi ? 'Kỳ vĩ đại dương Lặn ngắm San hô Cù Lao Chàm' : 'Ocean Paradise Snorkeling in Cham Biosphere Reserve',
        activities: [
          { time: '08:00', attractionName: isVi ? 'Cano lướt ngọn sóng Cù Lao Chàm' : 'High-Speed Jetboat to Cham Island', description: isVi ? 'Nhào lướt gió đại dương, thám hiểm san hô tự nhiên lộng lẫy.' : 'Skim white sea sprays towards Biosphere Reserve, guided by skilled native divers.', costVND: 650000 },
          { time: '12:00', attractionName: isVi ? 'Trải tiệc hải sản nướng hoang sơ biển xanh' : 'Pristine Beach BBQ & Native Shell Seafood', description: isVi ? 'Tiệc cua đá biển nướng dừa bùi ngọt lịm dạt dào.' : 'Indulge in wild caught grilled squids, stone crabs and local herbal tea.', costVND: 250000 }
        ]
      }
    ],
    savingTips: [
      isVi ? 'Hãy chọn xe máy tự lái từ VietCharm để thoải mái di dọc bờ biển An Bàng thơ mộng lãng mạn chỉ mất 15 phút thôi!' : 'Scoot along An Bang sandy coastwise roadway via motorbikes, saving 80% on private cabs.',
      isVi ? 'Thuyền thả hoa đăng sông Hoài chỉ nên thương thảo giá 100k - 150k cho một nhóm khách lẻ, tránh đi môi giới hàng rong.' : 'Always negotiate boat rides directly with boatwomen at riverside piers at official rates.'
    ]
  };
}

// Implement Vite and production config
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Use Vite middlewares to compile assets on-the-fly in dev mode
    app.use(vite.middlewares);
  } else {
    // Serve static files in production from dist/ folder
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running securely on http://localhost:${PORT}`);
  });
}

startServer();
