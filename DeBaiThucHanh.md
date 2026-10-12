Bài tập thực hành 3
ĐỀ BÀI: XÂY DỰNG ỨNG DỤNG QUẢN LÝ HỌC TẬP BẰNG REACT NATIVE
1. Mục tiêu
Xây dựng ứng dụng di động hỗ trợ sinh viên đại học quản lý hoạt động học tập, bao gồm môn học, thời khóa biểu, bài tập và kết quả học tập. Ứng dụng phải có giao diện thân thiện, dữ liệu thực tế và sử dụng Bottom Tab Navigation kết hợp Stack Navigation.

2. Yêu cầu chức năng
Màn hình 1. Trang chủ

Hiển thị họ tên, mã sinh viên.

Hiển thị danh sách môn học đang học.

Hiển thị các bài tập sắp đến hạn.

Màn hình 2. Môn học

Hiển thị danh sách môn học bằng FlatList.

Mỗi môn học gồm: mã môn học, tên môn học, số tín chỉ.

Tìm kiếm môn học theo tên.

Nhấn vào môn học để xem chi tiết.

Màn hình 3. Thời khóa biểu

Hiển thị lịch học trong tuần.

Mỗi buổi học gồm: tên môn học, thời gian và phòng học.

Cho phép xem chi tiết buổi học.

Màn hình 4. Bài tập

Hiển thị danh sách bài tập, môn học và hạn nộp.

Hiển thị trạng thái: chưa hoàn thành hoặc đã hoàn thành.

Cho phép cập nhật trạng thái bài tập.

Màn hình 5. Cá nhân

Hiển thị thông tin sinh viên: mã sinh viên, họ tên, lớp, ngành học.

Cho phép chỉnh sửa họ tên, email và số điện thoại.

3. Yêu cầu điều hướng
Bottom Tab Navigation: Sử dụng thanh điều hướng dưới màn hình gồm 5 tab tương ứng với 5 màn hình:

Tổng quan.

Môn học.

Thời khóa biểu.

Bài tập.

Cá nhân và kết quả học tập.

Stack Navigation: Sử dụng Stack Navigator để mở các màn hình chi tiết từ 5 màn hình chính, bao gồm:

Chi tiết môn học.

Chi tiết buổi học.

Chi tiết bài tập.

Chi tiết kết quả học tập.

Các màn hình chi tiết sử dụng dữ liệu của mục được chọn và có chức năng quay lại màn hình trước đó.

4. Yêu cầu kỹ thuật
Sử dụng React Native và React Navigation.

Kết hợp Bottom Tab Navigator và Native Stack Navigator.

Sử dụng FlatList để hiển thị danh sách.

Sử dụng useState, useEffect để quản lý trạng thái và cập nhật giao diện.

Tổ chức mã nguồn thành các thư mục riêng cho màn hình, thành phần giao diện và dữ liệu.

Sử dụng dữ liệu mẫu nhất quán giữa các màn hình.

Khuyến khích sử dụng AsyncStorage hoặc SQLite để lưu trữ dữ liệu.

Giao diện phải phù hợp với thiết bị di động, hỗ trợ tìm kiếm, lọc và xử lý các trường hợp không có dữ liệu.