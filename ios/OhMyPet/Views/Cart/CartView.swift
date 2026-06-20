import SwiftUI

struct CartView: View {
    @EnvironmentObject private var router: AppRouter
    @EnvironmentObject private var cart: CartStore

    private let checkout: CheckoutProvider = StubCheckoutProvider()

    @State private var isCheckingOut = false
    @State private var checkoutMessage: String?
    @State private var showCheckoutSheet = false

    var body: some View {
        ZStack {
            Color.canvas.ignoresSafeArea()

            if cart.isEmpty {
                emptyState
            } else {
                content
                bottomBar
            }
        }
        .navigationTitle("Panier")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showCheckoutSheet) {
            CheckoutComingSoonSheet(message: checkoutMessage ?? "")
                .presentationDetents([.height(280)])
        }
    }

    private var content: some View {
        ScrollView {
            VStack(spacing: Sp.md) {
                ForEach(cart.items) { item in
                    CartRow(
                        item: item,
                        onQuantityChange: { cart.setQuantity($0, for: item) },
                        onRemove: { withAnimation(Anim.spring) { cart.remove(item) } }
                    )
                }
            }
            .padding(.horizontal, Sp.lg)
            .padding(.top, Sp.md)
            .padding(.bottom, 180)
        }
    }

    private var bottomBar: some View {
        VStack(spacing: Sp.md) {
            HStack {
                Text("Sous-total")
                    .font(.callout)
                    .foregroundStyle(Color.inkSoft)
                Spacer()
                Text(formattedPrice(cents: cart.subtotalCents))
                    .font(.title2)
                    .foregroundStyle(Color.ink)
            }

            PrimaryButton(title: "Passer commande", systemImage: "arrow.right", isLoading: isCheckingOut) {
                startCheckout()
            }

            Text("Livraison calculée à l'étape suivante")
                .font(.caption)
                .foregroundStyle(Color.inkFaint)
        }
        .padding(Sp.lg)
        .background(
            Color.canvas
                .overlay(Rectangle().fill(Color.hairline).frame(height: 1), alignment: .top)
                .ignoresSafeArea()
        )
        .frame(maxHeight: .infinity, alignment: .bottom)
    }

    private var emptyState: some View {
        VStack(spacing: Sp.lg) {
            Image(systemName: "bag")
                .font(.system(size: 26, weight: .regular))
                .foregroundStyle(Color.ink)
                .frame(width: 64, height: 64)
                .background(Color.subtle, in: Circle())
                .overlay(Circle().strokeBorder(Color.hairline, lineWidth: 1))

            VStack(spacing: Sp.sm) {
                Text("Votre panier est vide")
                    .font(.title2)
                    .foregroundStyle(Color.ink)
                Text("Créez un portrait, puis ajoutez-le sur un cadre, une tasse ou une coque.")
                    .font(.callout)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(Color.inkSoft)
                    .padding(.horizontal, Sp.lg)
            }

            SecondaryButton(title: "Retour à la création", systemImage: "sparkles") {
                router.popToRoot()
            }
            .padding(.horizontal, Sp.xxl)
        }
        .padding(Sp.lg)
    }

    private func startCheckout() {
        isCheckingOut = true
        Task {
            do {
                let url = try await checkout.startCheckout(items: cart.items)
                // Future: open `url` in an in-app SafariView.
                await UIApplication.shared.open(url)
            } catch {
                checkoutMessage = (error as? LocalizedError)?.errorDescription
                    ?? "Une erreur est survenue."
                showCheckoutSheet = true
            }
            isCheckingOut = false
        }
    }
}

// MARK: - Row

private struct CartRow: View {
    let item: CartItem
    let onQuantityChange: (Int) -> Void
    let onRemove: () -> Void

    var body: some View {
        HStack(spacing: Sp.md) {
            ProductMockupView(category: item.category, art: .remote(item.imageURL))
                .padding(Sp.xs)
                .frame(width: 76, height: 76)
                .background(Color.subtle)
                .clipShape(RoundedRectangle(cornerRadius: Rd.sm, style: .continuous))

            VStack(alignment: .leading, spacing: 4) {
                Text(item.category.title)
                    .font(.headline)
                    .foregroundStyle(Color.ink)
                Text("\(item.variant.label) · \(item.themeTitle)")
                    .font(.caption)
                    .foregroundStyle(Color.inkSoft)
                Text(formattedPrice(cents: item.lineTotalCents))
                    .font(.callout)
                    .foregroundStyle(Color.ink)
                    .padding(.top, 2)
            }

            Spacer()

            VStack(alignment: .trailing, spacing: Sp.sm) {
                Button(action: onRemove) {
                    Image(systemName: "xmark")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(Color.inkSoft)
                }
                StepperPill(quantity: item.quantity, onChange: onQuantityChange)
            }
        }
        .padding(Sp.md)
        .background(Color.surface)
        .clipShape(RoundedRectangle(cornerRadius: Rd.lg, style: .continuous))
        .hairlineBorder(Rd.lg)
    }
}

/// Compact +/- pill used inside cart rows.
private struct StepperPill: View {
    let quantity: Int
    let onChange: (Int) -> Void

    var body: some View {
        HStack(spacing: Sp.md) {
            Button { onChange(quantity - 1) } label: {
                Image(systemName: "minus").font(.system(size: 12, weight: .semibold))
            }
            Text("\(quantity)")
                .font(.callout)
                .frame(minWidth: 16)
            Button { onChange(quantity + 1) } label: {
                Image(systemName: "plus").font(.system(size: 12, weight: .semibold))
            }
        }
        .foregroundStyle(Color.ink)
        .padding(.horizontal, Sp.sm)
        .padding(.vertical, Sp.xs)
        .background(Color.subtle)
        .clipShape(Capsule())
        .hairlineBorder(Rd.pill)
    }
}

// MARK: - Coming-soon sheet

private struct CheckoutComingSoonSheet: View {
    @Environment(\.dismiss) private var dismiss
    let message: String

    var body: some View {
        VStack(spacing: Sp.lg) {
            Image(systemName: "shippingbox")
                .font(.system(size: 26, weight: .regular))
                .foregroundStyle(Color.ink)
                .frame(width: 60, height: 60)
                .background(Color.subtle, in: Circle())
                .overlay(Circle().strokeBorder(Color.hairline, lineWidth: 1))
                .padding(.top, Sp.lg)

            Text("Commande bientôt disponible")
                .font(.title2)
                .foregroundStyle(Color.ink)

            Text(message)
                .font(.callout)
                .multilineTextAlignment(.center)
                .foregroundStyle(Color.inkSoft)
                .padding(.horizontal, Sp.lg)

            Spacer()

            PrimaryButton(title: "Compris") { dismiss() }
                .padding(.horizontal, Sp.lg)
                .padding(.bottom, Sp.lg)
        }
        .background(Color.canvas)
    }
}
