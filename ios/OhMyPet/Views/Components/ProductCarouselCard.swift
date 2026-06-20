import SwiftUI

/// A tappable product card for the result-screen carousel: the portrait composited
/// on the object, the product name and its starting price.
struct ProductCarouselCard: View {
    let category: ProductCategory
    let art: MockupArt
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: Sp.sm) {
                ProductMockupView(category: category, art: art)
                    .padding(Sp.sm)
                    .frame(width: 150, height: 150)
                    .background(Color.subtle)
                    .clipShape(RoundedRectangle(cornerRadius: Rd.md, style: .continuous))

                VStack(alignment: .leading, spacing: 2) {
                    Text(category.title)
                        .font(.callout)
                        .foregroundStyle(Color.ink)
                    Text("À partir de \(formattedPrice(cents: category.basePriceCents))")
                        .font(.caption)
                        .foregroundStyle(Color.inkSoft)
                }
                .padding(.horizontal, Sp.xs)
                .padding(.bottom, Sp.xs)
            }
            .frame(width: 166)
            .background(Color.surface)
            .clipShape(RoundedRectangle(cornerRadius: Rd.lg, style: .continuous))
            .hairlineBorder(Rd.lg)
        }
        .buttonStyle(PressScaleStyle())
    }
}
