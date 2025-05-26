import React from 'react';
import { ScrollView, Text, StyleSheet, Pressable } from 'react-native';
import Colors from '@/constants/colors';
import { productCategories } from '@/mocks/products';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {productCategories.map((category) => (
        <Pressable
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.selectedCategory
          ]}
          onPress={() => onSelectCategory(category)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}
          >
            {category}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategory: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  selectedCategoryText: {
    color: 'white',
  },
});