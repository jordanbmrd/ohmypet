import SwiftUI
import Kingfisher

struct ResultPreviewView: View {
    let job: GenerationJob
    let theme: PosterTheme
    @EnvironmentObject private var router: AppRouter

    @State private var shareImage: UIImage?
    @State private var showShare = false
    @State private var savedToast = false

    /// Frame leads as the hero product; the rest live in the carousel.
    private let heroProduct: ProductCategory = .frame

    var body: some View {
        ZStack {
            Color.canvas.ignoresSafeArea()

            ScrollView {
                VStack(alignment: .leading, spacing: Sp.xl) {
                    portraitHeader
                    productSection
                }
                .padding(.bottom, 150)
            }

            bottomBar

            if savedToast {
                ToastView(text: "Enregistré dans Photos")
                    .transition(.move(edge: .top).combined(with: .opacity))
            }
        }
        .navigationTitle("Votre portrait")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button("Recommencer") { router.popToRoot() }
                    .font(.callout)
                    .foregroundStyle(Color.ink)
            }
            ToolbarItem(placement: .topBarTrailing) {
                Menu {
                    Button { saveToPhotos() } label: {
                        Label("Enregistrer dans Photos", systemImage: "arrow.down")
                    }
                    Button { prepareShare() } label: {
                        Label("Partager", systemImage: "square.and.arrow.up")
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                        .font(.system(size: 16))
                        .foregroundStyle(Color.ink)
                }
            }
            CartToolbarButton()
        }
        .sheet(isPresented: $showShare) {
            if let shareImage {
                ShareSheet(items: [shareImage])
            }
        }
    }

    private var portraitHeader: some View {
        VStack(spacing: Sp.lg) {
            VStack(spacing: Sp.xs) {
                Text("Votre portrait")
                    .eyebrowStyle()
                Text(theme.title)
                    .font(.title2)
                    .foregroundStyle(Color.ink)
            }
            .padding(.top, Sp.sm)

            // Gallery mat — poster floated inside a thin white frame.
            AsyncPosterImage(url: job.resultImageURL, cornerRadius: Rd.sm)
                .aspectRatio(1, contentMode: .fit)
                .padding(Sp.md)
                .background(Color.surface)
                .clipShape(RoundedRectangle(cornerRadius: Rd.md, style: .continuous))
                .hairlineBorder(Rd.md)
                .shadow(color: .ink.opacity(0.08), radius: 24, y: 14)
                .frame(maxWidth: 320)
                .padding(.horizontal, Sp.lg)
        }
        .frame(maxWidth: .infinity)
    }

    @ViewBuilder
    private var productSection: some View {
        if let url = job.resultImageURL {
            VStack(alignment: .leading, spacing: Sp.md) {
                VStack(alignment: .leading, spacing: Sp.xs) {
                    Text("Sur vos objets")
                        .eyebrowStyle()
                    Text("Offrez-lui une seconde vie")
                        .font(.title2)
                        .tracking(-0.3)
                        .foregroundStyle(Color.ink)
                }
                .padding(.horizontal, Sp.lg)

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: Sp.md) {
                        ForEach(ProductCategory.allCases) { category in
                            ProductCarouselCard(category: category, art: .remote(url)) {
                                router.push(.productDetail(
                                    category: category, imageURL: url, themeTitle: theme.title
                                ))
                            }
                        }
                    }
                    .padding(.horizontal, Sp.lg)
                }
            }
        }
    }

    private var bottomBar: some View {
        VStack(spacing: Sp.md) {
            PrimaryButton(title: "Commander un objet", systemImage: "arrow.right") {
                if let url = job.resultImageURL {
                    router.push(.productDetail(
                        category: heroProduct, imageURL: url, themeTitle: theme.title
                    ))
                }
            }
        }
        .padding(Sp.lg)
        .background(
            Color.canvas
                .overlay(Rectangle().fill(Color.hairline).frame(height: 1), alignment: .top)
                .ignoresSafeArea()
        )
        .frame(maxHeight: .infinity, alignment: .bottom)
    }

    private func prepareShare() {
        guard let url = job.resultImageURL else { return }
        KingfisherManager.shared.retrieveImage(with: url) { result in
            if case let .success(value) = result {
                shareImage = value.image
                showShare = true
            }
        }
    }

    private func saveToPhotos() {
        guard let url = job.resultImageURL else { return }
        KingfisherManager.shared.retrieveImage(with: url) { result in
            if case let .success(value) = result {
                UIImageWriteToSavedPhotosAlbum(value.image, nil, nil, nil)
                withAnimation(Anim.spring) { savedToast = true }
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    withAnimation(Anim.smooth) { savedToast = false }
                }
            }
        }
    }
}

struct ToastView: View {
    let text: String
    var body: some View {
        VStack {
            Text(text)
                .font(.callout)
                .foregroundStyle(Color.canvas)
                .padding(.horizontal, Sp.md)
                .padding(.vertical, Sp.sm)
                .background(Color.ink, in: Capsule())
                .padding(.top, Sp.md)
            Spacer()
        }
    }
}
