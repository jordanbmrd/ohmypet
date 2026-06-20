import SwiftUI
import Kingfisher

/// Loads a generated poster from a remote URL with a shimmer placeholder.
struct AsyncPosterImage: View {
    let url: URL?
    var cornerRadius: CGFloat = Rd.lg

    var body: some View {
        KFImage(url)
            .resizable()
            .placeholder {
                ShimmerView()
            }
            .fade(duration: 0.3)
            .aspectRatio(contentMode: .fill)
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
    }
}
