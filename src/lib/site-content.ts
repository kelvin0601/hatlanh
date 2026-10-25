export type SitePageKey = "home" | "story" | "farm" | "contact";
export type SiteContent = Record<string, string>;

export interface SiteContentField {
  key: string;
  label: string;
  group: string;
  type: "text" | "textarea" | "image" | "gallery";
  defaultValue: string;
}

export interface SitePageDefinition {
  key: SitePageKey;
  title: string;
  route: string;
  description: string;
  fields: SiteContentField[];
}

const field = (key: string, label: string, group: string, type: SiteContentField["type"], defaultValue: string): SiteContentField => ({ key, label, group, type, defaultValue });

export const SITE_PAGE_DEFINITIONS: SitePageDefinition[] = [
  {
    key: "home",
    title: "Trang chủ",
    route: "/",
    description: "Hero và các khối giới thiệu trên trang chủ.",
    fields: [
      field("heroEyebrow", "Nhãn nhỏ", "Hero", "text", "Nguyên lành hạt"),
      field("heroTitle", "Tiêu đề", "Hero", "textarea", "Từ hạt thiên nhiên,\nđến những ngày\nan nhiên."),
      field("heroBody", "Mô tả", "Hero", "textarea", "Những hạt ngũ cốc mộc mạc từ quê nhà, được chọn lựa bằng sự trân trọng, mang đến những bữa ăn giản dị và đủ đầy."),
      field("heroImage", "Ảnh nền", "Hero", "image", "/images/01_hero/hero-desktop-clean.png"),
      field("heroImageAlt", "Alt ảnh", "Hero", "text", "Ngũ cốc An Vị từ những hạt thiên nhiên"),
      field("ingredientsEyebrow", "Nhãn nhỏ", "Nguyên liệu", "text", "Nguyên liệu"),
      field("ingredientsTitle", "Tiêu đề", "Nguyên liệu", "textarea", "Những hạt an lành\ntừ đất trời"),
      field("ingredientsBody", "Mô tả", "Nguyên liệu", "textarea", "Mỗi loại hạt mang một hương vị, một vùng đất và một câu chuyện riêng. Khi kết hợp lại, chúng tạo nên nguồn dinh dưỡng tự nhiên, hài hòa và tốt lành cho cơ thể."),
      field("storyEyebrow", "Nhãn nhỏ", "Câu chuyện", "text", "Câu chuyện An Vị"),
      field("storyTitle", "Tiêu đề", "Câu chuyện", "textarea", "Từ những\nmiền quê\nbình dị"),
      field("storyBody", "Mô tả", "Câu chuyện", "textarea", "Chúng tôi tin rằng mỗi hạt ngũ cốc đều mang trong mình tinh túy của đất trời, sự chăm chút của người nông dân và giá trị của một lối sống lành mạnh, gần gũi."),
      field("storyImage", "Ảnh nền", "Câu chuyện", "image", "/images/03_story/farmer-banner-hd.jpg"),
      field("storyImageAlt", "Alt ảnh", "Câu chuyện", "text", "Người nông dân giữa vùng nguyên liệu xanh"),
      field("productsEyebrow", "Nhãn nhỏ", "Sản phẩm", "text", "Sản phẩm nổi bật"),
      field("productsTitle", "Tiêu đề", "Sản phẩm", "text", "Ngũ cốc cho một cuộc sống lành mạnh"),
      field("mindfulEyebrow", "Nhãn nhỏ", "Sống lành", "text", "A moment of calm"),
      field("mindfulTitle", "Tiêu đề", "Sống lành", "textarea", "Một chút an yên\ncho mỗi ngày"),
      field("mindfulBody", "Mô tả", "Sống lành", "textarea", "Giữa những bộn bề thường nhật, hãy dành một chút thời gian cho bản thân. Một bữa ăn giản dị, một tách trà ấm và những hạt ngũ cốc lành — để nuôi dưỡng cả thân và tâm."),
      field("mindfulImage", "Ảnh nền", "Sống lành", "image", "/images/05_lifestyle/breakfast-banner-hd.jpg"),
      field("mindfulImageAlt", "Alt ảnh", "Sống lành", "text", "Bữa sáng ngũ cốc bên tách trà"),
      field("valuesEyebrow", "Nhãn nhỏ", "Giá trị", "text", "Vì sao chọn An Vị"),
      field("valuesTitle", "Tiêu đề", "Giá trị", "text", "Lành từ gốc, tốt cho bạn"),
      field("testimonialsEyebrow", "Nhãn nhỏ", "Khách hàng", "text", "Khách hàng nói về An Vị"),
      field("testimonialsTitle", "Tiêu đề", "Khách hàng", "text", "Những chia sẻ chân thật"),
      field("journalEyebrow", "Nhãn nhỏ", "Bài viết", "text", "Blog"),
      field("journalTitle", "Tiêu đề", "Bài viết", "text", "Chuyện an vị, chuyện sống lành"),
      field("newsletterEyebrow", "Nhãn nhỏ", "Nhận tin", "text", "Đăng ký nhận tin"),
      field("newsletterTitle", "Tiêu đề", "Nhận tin", "text", "Cùng An Vị sống lành mỗi ngày"),
      field("newsletterBody", "Mô tả", "Nhận tin", "textarea", "Nhận thông tin về sản phẩm mới, công thức hay và những câu chuyện tử tế."),
    ],
  },
  {
    key: "story",
    title: "Câu chuyện",
    route: "/cau-chuyen",
    description: "Nội dung chính và hình ảnh trang Câu chuyện.",
    fields: [
      field("heroEyebrow", "Nhãn nhỏ", "Hero", "text", "Câu chuyện An Vị"),
      field("heroTitle", "Tiêu đề", "Hero", "textarea", "Từ những hạt lành\ncủa quê nhà"),
      field("heroBody", "Mô tả", "Hero", "textarea", "An Vị sinh ra từ tình yêu với quê hương Nghệ An — nơi những cánh đồng, núi rừng và con người mộc mạc nuôi dưỡng từng hạt ngũ cốc lành cho bữa ăn mỗi ngày."),
      field("heroImage", "Ảnh nền", "Hero", "image", "/images/03_story/farmer-banner-hd.jpg"),
      field("heroImageAlt", "Alt ảnh", "Hero", "text", "Người nông dân giữa đồi chè xanh"),
      field("originEyebrow", "Nhãn nhỏ", "Nguồn cội", "text", "Nguồn cội"),
      field("originTitle", "Tiêu đề", "Nguồn cội", "text", "Từ mảnh đất Nghệ An thân thương"),
      field("originBody", "Mô tả", "Nguồn cội", "textarea", "Nghệ An — mảnh đất đầy nắng gió nhưng cũng vô cùng trù phú, nơi nuôi dưỡng những mùa màng chất lượng, những loại hạt ngon lành và những con người cần cù, thật thà."),
      field("originImage", "Ảnh", "Nguồn cội", "image", "/images/11_story/song-giang-con-cuong.jpg"),
      field("originImageAlt", "Alt ảnh", "Nguồn cội", "text", "Sông Giăng, Con Cuông, Nghệ An"),
      field("journeyEyebrow", "Nhãn nhỏ", "Hành trình", "text", "Hành trình của hạt"),
      field("journeyTitle", "Tiêu đề", "Hành trình", "text", "Từ hạt giống nhỏ đến bữa ăn lành"),
      field("journeyBody", "Mô tả", "Hành trình", "textarea", "Chúng tôi tin rằng những điều tốt đẹp luôn bắt đầu từ những điều giản dị. Mỗi hạt ngũ cốc đều là kết tinh của đất trời, của sự chăm chút và lòng biết ơn."),
      field("journeyImage", "Ảnh", "Hành trình", "image", "/images/11_story/song-giang-nha-tranh.jpg"),
      field("journeyImageAlt", "Alt ảnh", "Hành trình", "text", "Nhà tranh bên Sông Giăng"),
      field("valuesEyebrow", "Nhãn nhỏ", "Giá trị", "text", "Giá trị cốt lõi"),
      field("valuesTitle", "Tiêu đề", "Giá trị", "text", "Những điều An Vị luôn theo đuổi"),
      field("valuesBody", "Mô tả", "Giá trị", "textarea", "Chúng tôi không chỉ làm ra những sản phẩm ngũ cốc, mà còn mong muốn lan tỏa một lối sống lành mạnh và cân bằng hơn."),
      field("valuesImage", "Ảnh nền", "Giá trị", "image", "/images/11_story/song-giang-con-cuong.jpg"),
      field("valuesImageAlt", "Alt ảnh", "Giá trị", "text", "Dòng sông Giăng giữa núi rừng Con Cuông"),
      field("visionEyebrow", "Nhãn nhỏ", "Tầm nhìn", "text", "Tầm nhìn"),
      field("visionTitle", "Tiêu đề", "Tầm nhìn", "text", "Nhiều hơn một bữa ăn ngon"),
      field("visionBody", "Mô tả", "Tầm nhìn", "textarea", "An Vị hướng đến một tương lai nơi mọi người đều có thể dễ dàng lựa chọn thực phẩm sạch, tốt cho sức khỏe và thân thiện với môi trường."),
      field("visionImage", "Ảnh", "Tầm nhìn", "image", "/images/05_lifestyle/breakfast-banner-hd.jpg"),
      field("visionImageAlt", "Alt ảnh", "Tầm nhìn", "text", "Bữa ăn lành cùng An Vị"),
      field("ctaTitle", "Tiêu đề", "CTA cuối trang", "text", "Cùng An Vị lan tỏa những điều lành"),
      field("ctaBody", "Mô tả", "CTA cuối trang", "textarea", "Vì một cuộc sống khỏe mạnh hơn, bình yên hơn, bắt đầu từ những bữa ăn mỗi ngày."),
      field("ctaImage", "Ảnh nền", "CTA cuối trang", "image", "/images/11_story/song-giang-dong-trau.jpg"),
      field("ctaImageAlt", "Alt ảnh", "CTA cuối trang", "text", "Sông Giăng và đàn trâu ven bờ"),
    ],
  },
  {
    key: "farm",
    title: "Từ nông trại",
    route: "/tu-nong-trai",
    description: "Hero, quy trình sản xuất và hình ảnh nhà xưởng.",
    fields: [
      field("heroEyebrow", "Nhãn nhỏ", "Hero", "text", "Từ nông trại An Vị"),
      field("heroTitle", "Tiêu đề", "Hero", "textarea", "Hành trình những hạt lành\ntừ nông trại đến bàn ăn"),
      field("heroBody", "Mô tả", "Hero", "textarea", "Chúng tôi trực tiếp lựa chọn nguyên liệu, kiểm soát quy trình sản xuất và chế biến với sự tỉ mỉ trong từng công đoạn, để mang đến những sản phẩm ngũ cốc thuần khiết, an toàn và giàu dinh dưỡng cho mọi gia đình."),
      field("heroImage", "Ảnh nền", "Hero", "image", "/images/03_story/farmer-banner-hd.jpg"),
      field("heroImageAlt", "Alt ảnh", "Hero", "text", "Người An Vị chọn lọc nguyên liệu trong nhà xưởng"),
      field("benefit1Title", "Tiêu đề", "Cam kết 1", "text", "Nguyên liệu chọn lọc"),
      field("benefit1Body", "Mô tả", "Cam kết 1", "text", "từ vùng trồng uy tín"),
      field("benefit2Title", "Tiêu đề", "Cam kết 2", "text", "Quy trình sản xuất"),
      field("benefit2Body", "Mô tả", "Cam kết 2", "text", "đạt tiêu chuẩn vệ sinh"),
      field("benefit3Title", "Tiêu đề", "Cam kết 3", "text", "Không chất bảo quản"),
      field("benefit3Body", "Mô tả", "Cam kết 3", "text", "không hương liệu nhân tạo"),
      field("benefit4Title", "Tiêu đề", "Cam kết 4", "text", "Kiểm soát chất lượng"),
      field("benefit4Body", "Mô tả", "Cam kết 4", "text", "ở từng công đoạn"),
      field("benefit5Title", "Tiêu đề", "Cam kết 5", "text", "Sản phẩm an toàn"),
      field("benefit5Body", "Mô tả", "Cam kết 5", "text", "và giàu dinh dưỡng"),
      field("processEyebrow", "Nhãn nhỏ", "Quy trình", "text", "Quy trình sản xuất"),
      field("processTitle", "Tiêu đề", "Quy trình", "textarea", "Từ những hạt lành\nđến sản phẩm An Vị"),
      field("processBody", "Mô tả", "Quy trình", "textarea", "Mỗi hạt ngũ cốc đều trải qua một hành trình nghiêm ngặt, từ khâu chọn lọc nguyên liệu, làm sạch, xử lý, rang sấy đến đóng gói, nhằm giữ trọn hương vị tự nhiên và giá trị dinh dưỡng."),
      field("step1Title", "Tiêu đề", "Bước 1", "text", "Chọn lọc nguyên liệu"),
      field("step1Body", "Mô tả", "Bước 1", "textarea", "Lựa chọn những hạt ngũ cốc chất lượng từ các vùng trồng uy tín."),
      field("step1Image", "Ảnh", "Bước 1", "image", "/images/03_story/hands-grains.jpg"),
      field("step1ImageAlt", "Alt ảnh", "Bước 1", "text", "Chọn lọc nguyên liệu ngũ cốc"),
      field("step2Title", "Tiêu đề", "Bước 2", "text", "Làm sạch và xử lý"),
      field("step2Body", "Mô tả", "Bước 2", "textarea", "Làm sạch tạp chất, loại bỏ hạt kém chất lượng."),
      field("step2Image", "Ảnh", "Bước 2", "image", "/images/04_products/cereal-bowl-1.jpg"),
      field("step2ImageAlt", "Alt ảnh", "Bước 2", "text", "Làm sạch nguyên liệu"),
      field("step3Title", "Tiêu đề", "Bước 3", "text", "Rang sấy giữ trọn dinh dưỡng"),
      field("step3Body", "Mô tả", "Bước 3", "textarea", "Sử dụng công nghệ phù hợp để giữ hương vị tự nhiên và dưỡng chất."),
      field("step3Image", "Ảnh", "Bước 3", "image", "/images/04_products/cereal-bowl-2.jpg"),
      field("step3ImageAlt", "Alt ảnh", "Bước 3", "text", "Rang sấy ngũ cốc"),
      field("step4Title", "Tiêu đề", "Bước 4", "text", "Đóng gói và kiểm định"),
      field("step4Body", "Mô tả", "Bước 4", "textarea", "Đóng gói trong môi trường vô trùng, kiểm tra chất lượng trước khi đến tay khách hàng."),
      field("step4Image", "Ảnh", "Bước 4", "image", "/images/04_products/packaging-concept.jpg"),
      field("step4ImageAlt", "Alt ảnh", "Bước 4", "text", "Đóng gói sản phẩm An Vị"),
      field("factoryEyebrow", "Nhãn nhỏ", "Nhà xưởng", "text", "Không gian sản xuất"),
      field("factoryTitle", "Tiêu đề", "Nhà xưởng", "text", "Nhà xưởng An Vị"),
      field("factoryBody", "Mô tả", "Nhà xưởng", "textarea", "Chúng tôi đầu tư hệ thống nhà xưởng hiện đại, đảm bảo điều kiện vệ sinh an toàn thực phẩm, với quy trình vận hành khép kín."),
      field("factoryGallery", "Thư viện ảnh", "Nhà xưởng", "gallery", JSON.stringify([
        { url: "/images/03_story/farmer-banner-hd.jpg", alt: "Không gian vùng nguyên liệu An Vị" },
        { url: "/images/04_products/product-energy-hd.jpg", alt: "Ngũ cốc giàu năng lượng" },
        { url: "/images/04_products/product-traditional-hd.jpg", alt: "Sản phẩm ngũ cốc truyền thống" },
        { url: "/images/03_story/hands-grains.jpg", alt: "Chọn lọc hạt ngũ cốc" },
        { url: "/images/04_products/product-family-hd.jpg", alt: "Các sản phẩm An Vị" },
        { url: "/images/04_products/product-nutrition-hd.jpg", alt: "Ngũ cốc dinh dưỡng cân bằng" },
      ])),
    ],
  },
  {
    key: "contact",
    title: "Liên hệ",
    route: "/lien-he",
    description: "Tiêu đề và thông tin liên hệ doanh nghiệp.",
    fields: [
      field("heroTitle", "Tiêu đề", "Giới thiệu", "text", "Liên hệ với An Vị"),
      field("heroBody", "Mô tả", "Giới thiệu", "textarea", "Bạn có câu hỏi, góp ý hoặc muốn hợp tác? Hãy gửi lời nhắn, chúng tôi sẽ phản hồi sớm nhất."),
      field("phone", "Hotline", "Thông tin liên hệ", "text", "028 7300 0888"),
      field("email", "Email", "Thông tin liên hệ", "text", "hello@anvi.vn"),
      field("address", "Địa chỉ", "Thông tin liên hệ", "textarea", "TP. Hồ Chí Minh, Việt Nam"),
      field("cooperationTitle", "Tiêu đề", "Hợp tác", "text", "Hợp tác và phân phối"),
      field("cooperationBody", "Mô tả", "Hợp tác", "textarea", "Bạn muốn phân phối sản phẩm An Vị? Liên hệ qua email hoặc gửi lời nhắn, chúng tôi sẽ trao đổi chi tiết."),
    ],
  },
];

export function getSitePageDefinition(key: string) {
  return SITE_PAGE_DEFINITIONS.find((page) => page.key === key);
}

export function getDefaultSiteContent(key: SitePageKey): SiteContent {
  const page = getSitePageDefinition(key);
  return Object.fromEntries((page?.fields ?? []).map((item) => [item.key, item.defaultValue]));
}
