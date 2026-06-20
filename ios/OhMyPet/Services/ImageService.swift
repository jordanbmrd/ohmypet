import UIKit

/// Resizes & encodes pet photos for upload.
enum ImageService {
    static let maxDimension: CGFloat = 1024
    static let jpegQuality: CGFloat = 0.85

    /// Downscales to fit within `maxDimension` and returns JPEG data.
    static func prepareForUpload(_ image: UIImage) -> Data? {
        let resized = resize(image, maxDimension: maxDimension)
        return resized.jpegData(compressionQuality: jpegQuality)
    }

    static func resize(_ image: UIImage, maxDimension: CGFloat) -> UIImage {
        let size = image.size
        let largestSide = max(size.width, size.height)
        guard largestSide > maxDimension else { return image }

        let scale = maxDimension / largestSide
        let newSize = CGSize(width: size.width * scale, height: size.height * scale)

        let format = UIGraphicsImageRendererFormat.default()
        format.scale = 1
        let renderer = UIGraphicsImageRenderer(size: newSize, format: format)
        return renderer.image { _ in
            image.draw(in: CGRect(origin: .zero, size: newSize))
        }
    }
}
