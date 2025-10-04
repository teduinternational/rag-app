interface SampleQuestion {
  category: string;
  question: string;
  description: string;
}

export const sampleQuestions: SampleQuestion[] = [
  {
    category: "Chính sách",
    question: "Chính sách đổi trả của công ty như thế nào?",
    description: "Tìm hiểu về quy định đổi trả sản phẩm"
  },
  {
    category: "Chính sách",
    question: "Chính sách giao hàng có những điều khoản gì?",
    description: "Thông tin về thời gian và phí giao hàng"
  },
  {
    category: "Sản phẩm",
    question: "Máy pha cà phê có những tính năng gì đặc biệt?",
    description: "Chi tiết về sản phẩm máy pha cà phê"
  },
  {
    category: "Sản phẩm",
    question: "Tai nghe có hỗ trợ noise cancelling không?",
    description: "Tính năng khử tiếng ồn của tai nghe"
  },
  {
    category: "HR",
    question: "Quy định về nghỉ phép và ngày lễ như thế nào?",
    description: "Chính sách PTO và holiday của công ty"
  },
  {
    category: "HR",
    question: "Chính sách làm việc từ xa ra sao?",
    description: "Hướng dẫn remote work policy"
  },
  {
    category: "Kỹ thuật",
    question: "Làm thế nào để khắc phục sự cố WiFi router?",
    description: "Hướng dẫn troubleshooting mạng"
  },
  {
    category: "Kỹ thuật",
    question: "Những best practices về bảo mật nào cần tuân thủ?",
    description: "Quy tắc an ninh thông tin"
  }
];