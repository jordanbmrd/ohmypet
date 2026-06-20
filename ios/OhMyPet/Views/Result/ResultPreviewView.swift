import SwiftUI
import Kingfisher

struct ResultPreviewView: View {
    let job: GenerationJob
    let theme: PosterTheme
    @EnvironmentObject private var router: AppRouter

    @State private var shareImage: UIImage?
    @State private var showShare = false
    @State private var savedToast = false

    var body: some View {
        ZStack {
            Color.canvas.ignoresSafeArea()

            ScrollView {
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
                        .padding(.horizontal, Sp.lg)
                }
                .padding(.bottom, Sp.md)
            }

            VStack(spacing: Sp.md) {
                PrimaryButton(title: "Commander un tirage", systemImage: "arrow.right") {
                    // Phase 3 — Shopify ordering.
                }
                HStack(spacing: Sp.sm) {
                    SecondaryButton(title: "Enregistrer", systemImage: "arrow.down") {
                        saveToPhotos()
                    }
                    SecondaryButton(title: "Partager", systemImage: "square.and.arrow.up") {
                        prepareShare()
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

            if savedToast {
                ToastView(text: "Enregistré dans Photos")
                    .transition(.move(edge: .top).combined(with: .opacity))
            }
        }
        .navigationTitle("Votre portrait")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button("Recommencer") { router.popToRoot() }
                    .font(.callout)
                    .foregroundStyle(Color.ink)
            }
        }
        .sheet(isPresented: $showShare) {
            if let shareImage {
                ShareSheet(items: [shareImage])
            }
        }
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
