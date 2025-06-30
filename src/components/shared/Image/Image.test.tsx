import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Image from './Image';

describe('Image Component', () => {
  const defaultProps = {
    src: 'https://example.com/test-image.jpg',
    alt: 'Test image',
  };

  it('renders with basic props', () => {
    render(<Image {...defaultProps} />);
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
  });

  it('renders with custom width and height', () => {
    render(<Image {...defaultProps} width="200px" height="150px" />);
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
  });

  it('renders with expandable prop', () => {
    render(<Image {...defaultProps} expandOnClick={true} />);
    const images = screen.getAllByAltText('Test image');
    expect(images).toHaveLength(2); // Main image + full-screen image
    expect(images[0]).toBeInTheDocument();
  });

  it('renders with custom object fit', () => {
    render(<Image {...defaultProps} objectFit="contain" />);
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
  });

  it('renders with border radius', () => {
    render(<Image {...defaultProps} borderRadius="8px" />);
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
  });

  it('calls onClick when provided and not expandable', () => {
    const handleClick = jest.fn();
    render(<Image {...defaultProps} expandOnClick={false} onClick={handleClick} />);
    const image = screen.getByAltText('Test image');
    fireEvent.click(image);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when expandable', () => {
    const handleClick = jest.fn();
    render(<Image {...defaultProps} expandOnClick={true} onClick={handleClick} />);
    const images = screen.getAllByAltText('Test image');
    fireEvent.click(images[0]); // Click the main image
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with title attribute', () => {
    render(<Image {...defaultProps} title="Test title" />);
    const container = screen.getByAltText('Test image').closest('div');
    expect(container).toHaveAttribute('title', 'Test title');
  });
}); 