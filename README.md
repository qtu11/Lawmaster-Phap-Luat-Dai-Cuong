# Qtusdev
# Lawmaster — Pháp Luật Đại Cương
# Live: https://lawmaster-phap-luat-dai-cuong.vercel.app/

<img src="https://files.catbox.moe/r4zyez.png" alt="QTusdev">

⚖️ Lawmaster là ứng dụng học tập trực tuyến thiết kế để giúp sinh viên ôn luyện và làm chủ ngân hàng 300 câu hỏi trắc nghiệm môn "Pháp luật đại cương". Ứng dụng tối ưu cho trải nghiệm ôn tập nhanh, thi thử và tự học với phản hồi lời giải ngay sau mỗi câu.

# Tính năng chính
<li><b>Đăng nhập & Cá nhân hóa:</b> Người dùng nhập tên để bắt đầu, lưu kết quả và theo dõi tiến độ.
<li><b>Leaderboard:</b> Bảng xếp hạng tính theo độ chính xác và thời gian hoàn thành, hiển thị Top 10 người chơi.
<li><b>Phản hồi tức thì:</b> Hiển thị đáp án đúng cùng giải thích pháp lý, kèm trích dẫn điều luật khi có.
<li><b>Ngân hàng 300 câu:</b> Bao quát các chủ đề cốt lõi (nguồn gốc Nhà nước, hệ thống pháp luật, Luật Dân sự, Hình sự, Phòng chống tham nhũng...).
<li><b>Xáo trộn thông minh:</b> Trộn ngẫu nhiên thứ tự câu và đáp án nhằm tăng hiệu quả ôn luyện.
<li><b>Lọc câu sai:</b> Lưu và tập hợp các câu làm sai để ôn tập riêng.
<li><b>Chế độ học:</b> "Thi thử" có đếm ngược và tính điểm; "Tự học" không giới hạn thời gian.

# Giao diện & trải nghiệm
<li>Thiết kế chuyên nghiệp theo tông màu Navy & Gold, áp dụng phong cách Glassmorphism.
<li>Responsive: Tương thích smartphone, tablet và desktop.
<li>Thanh tiến độ minh họa mức hoàn thành bộ câu hỏi.

# Công nghệ
<li><b>Frontend:</b> TypeScript + React (Vite), Tailwind CSS
<li><b>Lưu trữ:</b> LocalStorage (offline) — tùy chọn tích hợp <li><b>Firebase cho bảng xếp hạng online
<li><b>Icon:</b> Lucide Icons, FontAwesome
<li><b>Fonts</b>: Inter, Montserrat
# Cài đặt & chạy nhanh
Clone repository:

git clone https://github.com/qtu11/Lawmaster-Phap-Luat-Dai-Cuong.git
cd Lawmaster-Phap-Luat-Dai-Cuong

Mở dự án bằng VS Code và chạy Live Server hoặc dùng Vite:

npm install
npm run dev

Hoặc đơn giản mở index.html bằng trình duyệt để dùng bản tĩnh.

# Cấu trúc dự án (chính)
<li>index.html — điểm vào ứng dụng
<li>components — các component React chính (FlashcardScreen, QuizScreen, ResultScreen, WelcomeScreen, Header)
<li>services — loader câu hỏi, lưu trạng thái, TTS, theme
<li>300 câu.txt — nguồn câu hỏi gốc (dùng cho chuyển đổi sang JSON).

# Tác giả & Liên hệ
<li>Tác giả: qtusdev (GitHub: qtu11)
<li>Email: contact@qtusdev.website
<li>Website: qtusdev.website
<li>Bản quyền
© 2025 Lawmaster — Qtusdev. Bảo lưu mọi quyền.

