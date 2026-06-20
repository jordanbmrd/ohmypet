import SwiftUI
import Kingfisher

/// Source of the artwork composited onto a product — a generated portrait (remote
/// URL) or a bundled example image (asset name).
enum MockupArt: Hashable {
    case remote(URL)
    case asset(String)
}

/// Composites a portrait onto a product. The object itself is drawn as an editorial
/// SwiftUI stand-in (frame / mug / phone case). If a photoreal PNG named
/// `category.mockup.assetName` exists in the bundle it is used instead, with the art
/// placed inside `printRect` — so the whole view upgrades to photoreal with no refactor.
struct ProductMockupView: View {
    let category: ProductCategory
    let art: MockupArt

    var body: some View {
        if UIImage(named: category.mockup.assetName) != nil {
            photorealMockup
        } else {
            standInMockup
        }
    }

    // MARK: Artwork

    @ViewBuilder
    private var artwork: some View {
        switch art {
        case let .remote(url):
            KFImage(url)
                .resizable()
                .placeholder { ShimmerView() }
                .fade(duration: 0.25)
                .aspectRatio(contentMode: .fill)
        case let .asset(name):
            Image(name)
                .resizable()
                .aspectRatio(contentMode: .fill)
        }
    }

    // MARK: Photoreal path (future PNG assets)

    private var photorealMockup: some View {
        GeometryReader { geo in
            let m = category.mockup
            let rect = CGRect(
                x: m.printRect.minX * geo.size.width,
                y: m.printRect.minY * geo.size.height,
                width: m.printRect.width * geo.size.width,
                height: m.printRect.height * geo.size.height
            )
            ZStack {
                artwork
                    .frame(width: rect.width, height: rect.height)
                    .clipShape(RoundedRectangle(cornerRadius: m.cornerRadius, style: .continuous))
                    .rotationEffect(.degrees(m.rotationDegrees))
                    .position(x: rect.midX, y: rect.midY)
                    .opacity(m.artOpacity)
                Image(m.assetName)
                    .resizable()
                    .scaledToFit()
            }
        }
        .aspectRatio(1, contentMode: .fit)
    }

    // MARK: SwiftUI stand-in path (default)

    @ViewBuilder
    private var standInMockup: some View {
        switch category {
        case .frame: FrameStandIn(artwork: artwork)
        case .mug: MugStandIn(artwork: artwork)
        case .phoneCase: PhoneCaseStandIn(artwork: artwork)
        }
    }
}

// MARK: - Frame

private struct FrameStandIn<Art: View>: View {
    let artwork: Art

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            let mat = side * 0.10
            ZStack {
                RoundedRectangle(cornerRadius: Rd.sm, style: .continuous)
                    .fill(Color.surface)
                    .hairlineBorder(Rd.sm, color: .hairlineStrong)
                    .shadow(color: .ink.opacity(0.12), radius: 18, y: 12)

                artwork
                    .clipShape(RoundedRectangle(cornerRadius: 2, style: .continuous))
                    .overlay(RoundedRectangle(cornerRadius: 2, style: .continuous)
                        .strokeBorder(Color.ink.opacity(0.06), lineWidth: 1))
                    .padding(mat)
            }
            .frame(width: side, height: side)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .aspectRatio(1, contentMode: .fit)
    }
}

// MARK: - Mug

private struct MugStandIn<Art: View>: View {
    let artwork: Art

    var body: some View {
        GeometryReader { geo in
            let w = geo.size.width
            let h = geo.size.height
            let bodyWidth = w * 0.60
            let bodyHeight = h * 0.56
            let handleSize = bodyHeight * 0.62

            ZStack {
                // Handle — a ring tucked behind the body on the right.
                Circle()
                    .strokeBorder(Color.subtleStrong, lineWidth: handleSize * 0.20)
                    .frame(width: handleSize, height: handleSize)
                    .offset(x: bodyWidth * 0.46)

                // Body
                RoundedRectangle(cornerRadius: Rd.md, style: .continuous)
                    .fill(Color.surface)
                    .frame(width: bodyWidth, height: bodyHeight)
                    .hairlineBorder(Rd.md, color: .hairlineStrong)
                    .shadow(color: .ink.opacity(0.10), radius: 16, y: 10)

                // Art wrapped on the front
                artwork
                    .frame(width: bodyWidth * 0.70, height: bodyHeight * 0.72)
                    .clipShape(RoundedRectangle(cornerRadius: Rd.xs, style: .continuous))
                    // Subtle cylindrical shading.
                    .overlay(
                        LinearGradient(
                            colors: [.white.opacity(0.35), .clear, .clear, .ink.opacity(0.12)],
                            startPoint: .leading, endPoint: .trailing
                        )
                        .clipShape(RoundedRectangle(cornerRadius: Rd.xs, style: .continuous))
                    )
            }
            .frame(width: w, height: h)
        }
        .aspectRatio(1, contentMode: .fit)
    }
}

// MARK: - Phone case

private struct PhoneCaseStandIn<Art: View>: View {
    let artwork: Art

    var body: some View {
        GeometryReader { geo in
            let h = min(geo.size.height, geo.size.width * 1.9)
            let w = h * 0.50
            let radius = w * 0.20

            ZStack {
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .fill(Color.surface)
                    .frame(width: w, height: h)
                    .hairlineBorder(radius, color: .hairlineStrong)
                    .shadow(color: .ink.opacity(0.12), radius: 18, y: 12)

                artwork
                    .frame(width: w - 10, height: h - 10)
                    .clipShape(RoundedRectangle(cornerRadius: radius - 4, style: .continuous))

                // Camera bump, top-left.
                RoundedRectangle(cornerRadius: w * 0.12, style: .continuous)
                    .fill(.ultraThinMaterial)
                    .overlay(RoundedRectangle(cornerRadius: w * 0.12, style: .continuous)
                        .strokeBorder(Color.ink.opacity(0.15), lineWidth: 1))
                    .frame(width: w * 0.34, height: w * 0.34)
                    .overlay(
                        VStack(spacing: w * 0.04) {
                            HStack(spacing: w * 0.04) {
                                lens(w: w); lens(w: w)
                            }
                            lens(w: w)
                        }
                    )
                    .position(x: w * 0.32, y: h * 0.16)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
        .aspectRatio(1, contentMode: .fit)
    }

    private func lens(w: CGFloat) -> some View {
        Circle()
            .fill(Color.ink.opacity(0.55))
            .frame(width: w * 0.10, height: w * 0.10)
    }
}

#Preview {
    let url = URL(string: "https://example.com/portrait.png")!
    return HStack(spacing: 16) {
        ForEach(ProductCategory.allCases) { category in
            ProductMockupView(category: category, art: .remote(url))
                .frame(width: 110, height: 110)
        }
    }
    .padding()
    .background(Color.canvas)
}
