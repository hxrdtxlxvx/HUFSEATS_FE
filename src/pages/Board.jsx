import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Board = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    restaurant: "",
    content: ""
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  // 승인된 리뷰 불러오기
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('리뷰를 불러오는 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  // 폼 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.restaurant || !formData.content) {
      setSubmitStatus({
        type: 'error',
        message: '가게 이름과 후기 내용은 필수입니다.'
      });
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('reviews')
        .insert([
          { 
            name: formData.name || '익명',
            restaurant: formData.restaurant,
            content: formData.content,
            approved: false  // 기본적으로 승인되지 않은 상태
          }
        ]);
      
      if (error) throw error;
      
      // 폼 초기화
      setFormData({ name: "", restaurant: "", content: "" });
      setSubmitStatus({
        type: 'success',
        message: '게시글이 등록되었습니다. 관리자 검수 후 게시됩니다.'
      });
      
      // 5초 후에 상태 메시지 제거
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      
    } catch (error) {
      console.error('등록 중 오류가 발생했습니다:', error);
      setSubmitStatus({
        type: 'error',
        message: '등록에 실패했습니다. 다시 시도해주세요.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-4 px-4 pb-8">
      <h2 className="text-lg font-bold mb-4 text-center">📝 한 줄 게시판</h2>
      
      {/* 후기 작성 폼 */}
      <div className="max-w-md mx-auto mb-6 bg-white rounded-xl border border-gray-300 shadow-sm p-4">
        <h3 className="text-center font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-4">
          후기, 정보 등 자유롭게 작성해주세요 🍽️
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              이름 
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="미 입력시 익명"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              가게 이름 *
            </label>
            <input
              type="text"
              name="restaurant"
              value={formData.restaurant}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="가게 이름을 입력하세요"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              내용 *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="내용을 입력하세요"
              required
            ></textarea>
          </div>
          
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              {loading ? '제출 중...' : '등록하기'}
            </button>
          </div>
        </form>
        
        {/* 제출 상태 메시지 */}
        {submitStatus && (
          <div className={`mt-4 p-3 rounded-md ${
            submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {submitStatus.message}
          </div>
        )}
      </div>
      
      {/* 게시된 후기 목록 */}
      <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-300 shadow-sm p-4">
        <h3 className="text-center font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-4">
          글 목록
        </h3>
        
        {loading && <p className="text-center text-gray-500">로딩 중...</p>}
        
        {!loading && reviews.length === 0 && (
          <p className="text-center text-gray-500">아직 등록된 후기가 없습니다.</p>
        )}
        
        <ul className="divide-y divide-gray-200">
          {reviews.map((review) => (
            <li key={review.id} className="py-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">{review.restaurant}</h4>
                <span className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{review.content}</p>
              <p className="mt-1 text-sm text-gray-500 text-right">- {review.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Board;