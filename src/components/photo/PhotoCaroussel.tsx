import React from 'react';
import { View, Image, Dimensions, StyleSheet, ImageStyle, ViewStyle } from 'react-native';
import Carousel from 'react-native-snap-carousel';

type PhotosCarouselProps = {
  photos: { image: string }[];
  variant?: 'logements' | 'logement';
};

const PhotosCarousel: React.FC<PhotosCarouselProps> = ({ photos, variant = 'logements' }) => {
  const { width, height } = Dimensions.get('window');
  const containerWidth = variant === 'logement' ? width : width - 40; 
  const renderCarouselItem = ({ item }: { item: { image: string } }) => (
    <View style={[styles.carouselItemContainer, variantStyles[variant]?.carouselItemContainer]}>
      <Image
        source={{ uri: `data:image/jpeg;base64,${item.image}` }}
        style={[styles.carouselImage, variantStyles[variant]?.carouselImage]}
      />
    </View>
  );

  return (
    <View style={[styles.carouselContainer, variantStyles[variant]?.carouselContainer, { width: containerWidth }]}>
      <Carousel
        data={photos}
        renderItem={renderCarouselItem}
        sliderWidth={containerWidth}
        itemWidth={containerWidth}
        loop={true}
        enableSnap={true}
        inactiveSlideOpacity={0.4}
        inactiveSlideScale={0.6}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: 250,
    marginBottom: 15,
  },
  carouselItemContainer: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  carouselImage: {
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

const variantStyles: Record<
  string,
  {
    carouselContainer?: ViewStyle;
    carouselItemContainer?: ViewStyle;
    carouselImage?: ImageStyle;
  }
> = {
  logements: {
    carouselContainer: {},
    carouselItemContainer: {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    carouselImage: {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      resizeMode: 'cover',
      height:230
    },
  },
  logement: {
    carouselContainer: {
        marginBottom: 0,
        width: Dimensions.get('window').width, 
    },
    carouselItemContainer: {
        width: Dimensions.get('window').width, 
      borderTopLeftRadius: 0, 
      borderTopRightRadius: 0,
      backgroundColor: '#143b86',

    },
    carouselImage: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      resizeMode: 'contain',
      height:230
    },
  },
};

export default PhotosCarousel;
