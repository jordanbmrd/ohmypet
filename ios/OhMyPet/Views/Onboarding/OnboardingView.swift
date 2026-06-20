import SwiftUI

struct OnboardingView: View {
    @EnvironmentObject private var appState: AppState
    @State private var page = 0

    private let pages: [OnboardingPage] = [
        .init(index: "01",
              symbol: "pawprint",
              title: "Votre compagnon,\nen œuvre d'art",
              subtitle: "Transformez une simple photo de votre chien ou chat en portrait d'exception."),
        .init(index: "02",
              symbol: "sparkles",
              title: "Des thèmes\nsignés",
              subtitle: "Couverture de magazine, portrait royal, superhéros — un style pour chaque caractère.",
              previewAsset: "theme_royalty_portrait"),
        .init(index: "03",
              symbol: "shippingbox",
              title: "Livré chez vous,\nencadré",
              subtitle: "Commandez votre tirage imprimé, encadré avec soin, et reçu à votre porte."),
    ]

    var body: some View {
        ZStack {
            Color.canvas.ignoresSafeArea()

            VStack(spacing: 0) {
                TabView(selection: $page) {
                    ForEach(pages.indices, id: \.self) { i in
                        OnboardingPageView(page: pages[i]).tag(i)
                    }
                }
                .tabViewStyle(.page(indexDisplayMode: .never))
                .animation(Anim.spring, value: page)

                pageDots
                    .padding(.bottom, Sp.xl)

                VStack(spacing: Sp.md) {
                    PrimaryButton(
                        title: page == pages.count - 1 ? "Commencer" : "Continuer",
                        systemImage: "arrow.right"
                    ) {
                        advance()
                    }

                    Button(page < pages.count - 1 ? "Passer" : " ") { finish() }
                        .font(.callout)
                        .foregroundStyle(Color.inkSoft)
                        .opacity(page < pages.count - 1 ? 1 : 0)
                        .disabled(page == pages.count - 1)
                }
                .padding(.horizontal, Sp.lg)
                .padding(.bottom, Sp.lg)
            }
        }
    }

    private var pageDots: some View {
        HStack(spacing: Sp.sm) {
            ForEach(pages.indices, id: \.self) { i in
                Capsule()
                    .fill(i == page ? Color.ink : Color.hairlineStrong)
                    .frame(width: i == page ? 22 : 6, height: 6)
                    .animation(Anim.spring, value: page)
            }
        }
    }

    private func advance() {
        if page == pages.count - 1 {
            finish()
        } else {
            withAnimation(Anim.spring) { page += 1 }
        }
    }

    private func finish() {
        appState.hasSeenOnboarding = true
    }
}

struct OnboardingPage {
    let index: String
    let symbol: String
    let title: String
    let subtitle: String
    var previewAsset: String? = nil
}

struct OnboardingPageView: View {
    let page: OnboardingPage

    var body: some View {
        VStack(alignment: .leading, spacing: Sp.xl) {
            Spacer()

            Group {
                if let previewAsset = page.previewAsset {
                    Image(previewAsset)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 132, height: 132)
                        .clipShape(RoundedRectangle(cornerRadius: Rd.xl, style: .continuous))
                        .hairlineBorder(Rd.xl)
                } else {
                    ZStack {
                        RoundedRectangle(cornerRadius: Rd.xl, style: .continuous)
                            .fill(Color.surface)
                            .hairlineBorder(Rd.xl)
                            .frame(width: 96, height: 96)
                        Image(systemName: page.symbol)
                            .font(.system(size: 40, weight: .light))
                            .foregroundStyle(Color.ink)
                    }
                }
            }
            .shadow(color: .ink.opacity(0.08), radius: 16, y: 8)

            VStack(alignment: .leading, spacing: Sp.md) {
                Text(page.index)
                    .eyebrowStyle()

                Text(page.title)
                    .font(.display)
                    .tracking(-0.5)
                    .foregroundStyle(Color.ink)
                    .fixedSize(horizontal: false, vertical: true)

                Text(page.subtitle)
                    .font(.body)
                    .foregroundStyle(Color.inkSoft)
                    .lineSpacing(3)
                    .padding(.trailing, Sp.lg)
            }

            Spacer()
            Spacer()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, Sp.lg)
    }
}
