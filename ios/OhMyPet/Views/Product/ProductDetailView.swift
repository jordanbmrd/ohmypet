import SwiftUI

struct ProductDetailView: View {
    let category: ProductCategory
    let imageURL: URL
    let themeTitle: String

    @EnvironmentObject private var router: AppRouter
    @EnvironmentObject private var cart: CartStore

    @State private var selectedVariant: ProductVariant
    @State private var quantity = 1
    @State private var addedToast = false

    init(category: ProductCategory, imageURL: URL, themeTitle: String) {
        self.category = category
        self.imageURL = imageURL
        self.themeTitle = themeTitle
        _selectedVariant = State(initialValue: category.variants[0])
    }

    private var unitPriceCents: Int { category.basePriceCents + selectedVariant.priceDeltaCents }

    var body: some View {
        ZStack {
            Color.canvas.ignoresSafeArea()

            ScrollView {
                VStack(alignment: .leading, spacing: Sp.xl) {
                    ProductMockupView(category: category, art: .remote(imageURL))
                        .frame(maxWidth: .infinity)
                        .frame(height: 320)
                        .padding(Sp.lg)
                        .background(Color.subtle)
                        .clipShape(RoundedRectangle(cornerRadius: Rd.lg, style: .continuous))
                        .hairlineBorder(Rd.lg)

                    VStack(alignment: .leading, spacing: Sp.sm) {
                        Text(themeTitle)
                            .eyebrowStyle()
                        Text(category.title)
                            .font(.title1)
                            .tracking(-0.4)
                            .foregroundStyle(Color.ink)
                        Text(category.blurb)
                            .font(.callout)
                            .foregroundStyle(Color.inkSoft)
                            .lineSpacing(2)
                    }

                    variantPicker
                    quantityPicker
                }
                .padding(.horizontal, Sp.lg)
                .padding(.top, Sp.md)
                .padding(.bottom, 140)
            }

            bottomBar

            if addedToast {
                ToastView(text: "Ajouté au panier")
                    .transition(.move(edge: .top).combined(with: .opacity))
            }
        }
        .navigationTitle(category.title)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar { CartToolbarButton() }
    }

    private var variantPicker: some View {
        VStack(alignment: .leading, spacing: Sp.md) {
            Text(category.variantLabel)
                .font(.callout)
                .foregroundStyle(Color.inkSoft)

            FlowChips(variants: category.variants, selected: selectedVariant) { variant in
                withAnimation(Anim.spring) { selectedVariant = variant }
            }
        }
    }

    private var quantityPicker: some View {
        HStack {
            Text("Quantité")
                .font(.callout)
                .foregroundStyle(Color.inkSoft)
            Spacer()
            QuantityStepper(quantity: $quantity)
        }
    }

    private var bottomBar: some View {
        VStack(spacing: Sp.sm) {
            PrimaryButton(title: "Ajouter au panier · \(formattedPrice(cents: unitPriceCents * quantity))") {
                addToCart()
            }
            SecondaryButton(title: "Voir le panier", systemImage: "bag") {
                router.push(.cart)
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

    private func addToCart() {
        cart.add(CartItem(
            category: category,
            variant: selectedVariant,
            imageURL: imageURL,
            themeTitle: themeTitle,
            quantity: quantity
        ))
        withAnimation(Anim.spring) { addedToast = true }
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.6) {
            withAnimation(Anim.smooth) { addedToast = false }
        }
    }
}

// MARK: - Variant chips

private struct FlowChips: View {
    let variants: [ProductVariant]
    let selected: ProductVariant
    let onSelect: (ProductVariant) -> Void

    private let columns = [GridItem(.adaptive(minimum: 96), spacing: Sp.sm)]

    var body: some View {
        LazyVGrid(columns: columns, alignment: .leading, spacing: Sp.sm) {
            ForEach(variants) { variant in
                let isSelected = variant == selected
                Button { onSelect(variant) } label: {
                    Text(variant.label)
                        .font(.callout)
                        .frame(maxWidth: .infinity)
                        .frame(height: 46)
                        .foregroundStyle(isSelected ? Color.canvas : Color.ink)
                        .background(isSelected ? Color.ink : Color.surface)
                        .clipShape(RoundedRectangle(cornerRadius: Rd.md, style: .continuous))
                        .hairlineBorder(Rd.md, color: isSelected ? .clear : .hairline)
                }
                .buttonStyle(PressScaleStyle())
            }
        }
    }
}

// MARK: - Quantity stepper

struct QuantityStepper: View {
    @Binding var quantity: Int
    var range: ClosedRange<Int> = 1...20

    var body: some View {
        HStack(spacing: 0) {
            stepButton(systemImage: "minus", enabled: quantity > range.lowerBound) {
                quantity = max(range.lowerBound, quantity - 1)
            }
            Text("\(quantity)")
                .font(.headline)
                .foregroundStyle(Color.ink)
                .frame(minWidth: 36)
            stepButton(systemImage: "plus", enabled: quantity < range.upperBound) {
                quantity = min(range.upperBound, quantity + 1)
            }
        }
        .background(Color.surface)
        .clipShape(RoundedRectangle(cornerRadius: Rd.md, style: .continuous))
        .hairlineBorder(Rd.md)
    }

    private func stepButton(systemImage: String, enabled: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: systemImage)
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(enabled ? Color.ink : Color.inkFaint)
                .frame(width: 44, height: 44)
        }
        .disabled(!enabled)
    }
}
