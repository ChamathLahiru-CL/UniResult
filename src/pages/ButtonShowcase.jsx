import React, { useState } from 'react';
import { 
  HeartIcon, 
  StarIcon, 
  UserPlusIcon,
  ShoppingCartIcon,
  CogIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ArrowRightIcon,
  EyeIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import Button, { 
  SuccessButton, 
  DangerButton, 
  WarningButton, 
  InfoButton, 
  LoadingButton, 
  ToggleButton, 
  ButtonGroup 
} from '../components/Button';
import Toggle from '../components/Toggle';

const ButtonShowcase = () => {
  const [loading, setLoading] = useState(false);
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(true);
  const [activeButton, setActiveButton] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Button & Toggle Component Showcase
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive collection of reusable UI components
          </p>
        </div>

        <div className="space-y-12">
          {/* Button Variants */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Button Variants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Primary Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Primary Buttons</h3>
                <div className="space-y-3">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="primary" leftIcon={UserPlusIcon}>Add User</Button>
                  <Button variant="primary" rightIcon={ArrowRightIcon}>Continue</Button>
                  <Button variant="primary" size="small">Small</Button>
                  <Button variant="primary" size="large">Large Button</Button>
                </div>
              </div>

              {/* Secondary & Outline */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Secondary & Outline</h3>
                <div className="space-y-3">
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline" leftIcon={CogIcon}>Settings</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="link">Link Button</Button>
                  <Button variant="gradient" leftIcon={StarIcon}>Gradient</Button>
                </div>
              </div>

              {/* Status Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Status Buttons</h3>
                <div className="space-y-3">
                  <SuccessButton>Success</SuccessButton>
                  <DangerButton>Delete</DangerButton>
                  <WarningButton>Warning</WarningButton>
                  <InfoButton>Information</InfoButton>
                  <Button variant="google" leftIcon={DocumentArrowDownIcon}>Google Style</Button>
                </div>
              </div>
            </div>

            {/* Loading & Disabled States */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Loading & Disabled States</h3>
              <div className="flex flex-wrap gap-4">
                <LoadingButton loading={loading} onClick={handleLoadingDemo}>
                  {loading ? 'Processing...' : 'Start Loading Demo'}
                </LoadingButton>
                <Button disabled>Disabled Button</Button>
                <Button variant="outline" disabled leftIcon={TrashIcon}>Disabled with Icon</Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="small" variant="primary">Small</Button>
                <Button size="default" variant="primary">Default</Button>
                <Button size="large" variant="primary">Large</Button>
                <Button size="xl" variant="primary">Extra Large</Button>
              </div>
            </div>

            {/* Full Width */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Full Width Button</h3>
              <Button variant="primary" fullWidth leftIcon={ShoppingCartIcon}>
                Add to Cart - Full Width
              </Button>
            </div>
          </section>

          {/* Toggle Switches */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Toggle Switches</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Toggles */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700">Basic Toggles</h3>
                
                <Toggle
                  enabled={toggle1}
                  onChange={() => setToggle1(!toggle1)}
                  label="Email Notifications"
                  description="Receive updates via email"
                />
                
                <Toggle
                  enabled={toggle2}
                  onChange={() => setToggle2(!toggle2)}
                  label="Push Notifications"
                  description="Receive browser notifications"
                />
                
                <Toggle
                  enabled={toggle3}
                  onChange={() => setToggle3(!toggle3)}
                  label="Dark Mode"
                  description="Switch to dark theme"
                />

                <Toggle
                  enabled={false}
                  onChange={() => {}}
                  label="Disabled Toggle"
                  description="This toggle is disabled"
                  disabled={true}
                />
              </div>

              {/* Toggle Sizes & States */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700">Sizes & States</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 w-16">Small:</span>
                    <Toggle enabled={true} onChange={() => {}} size="small" />
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 w-16">Default:</span>
                    <Toggle enabled={true} onChange={() => {}} size="default" />
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 w-16">Large:</span>
                    <Toggle enabled={true} onChange={() => {}} size="large" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">Different States:</h4>
                  <div className="space-y-3">
                    <Toggle enabled={true} onChange={() => {}} label="Enabled State" />
                    <Toggle enabled={false} onChange={() => {}} label="Disabled State" />
                    <Toggle enabled={true} onChange={() => {}} label="With Description" description="This toggle has a description" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Toggle Buttons */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Toggle Buttons</h2>
            
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <ToggleButton
                  active={activeButton}
                  onClick={() => setActiveButton(!activeButton)}
                  activeText="ON"
                  inactiveText="OFF"
                />
                
                <ToggleButton
                  active={!activeButton}
                  onClick={() => setActiveButton(!activeButton)}
                  activeText="Enabled"
                  inactiveText="Disabled"
                  size="large"
                />
                
                <ToggleButton
                  active={activeButton}
                  onClick={() => setActiveButton(!activeButton)}
                  activeText="✓"
                  inactiveText="✗"
                  size="small"
                />
              </div>
            </div>
          </section>

          {/* Button Groups */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Button Groups</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Horizontal Button Group</h3>
                <ButtonGroup>
                  <Button variant="outline" leftIcon={EyeIcon}>View</Button>
                  <Button variant="outline" leftIcon={PencilIcon}>Edit</Button>
                  <Button variant="outline" leftIcon={BookmarkIcon}>Save</Button>
                  <Button variant="outline" leftIcon={TrashIcon}>Delete</Button>
                </ButtonGroup>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Vertical Button Group</h3>
                <ButtonGroup orientation="vertical">
                  <Button variant="outline">First Option</Button>
                  <Button variant="outline">Second Option</Button>
                  <Button variant="outline">Third Option</Button>
                </ButtonGroup>
              </div>
            </div>
          </section>

          {/* Icon Buttons */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Icon Buttons</h2>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" leftIcon={PlusIcon} size="small" className="rounded-full p-3">
                <span className="sr-only">Add</span>
              </Button>
              <Button variant="success" leftIcon={HeartIcon} size="default" className="rounded-full p-3">
                <span className="sr-only">Like</span>
              </Button>
              <Button variant="danger" leftIcon={TrashIcon} size="large" className="rounded-full p-4">
                <span className="sr-only">Delete</span>
              </Button>
              <Button variant="outline" leftIcon={StarIcon} className="rounded-full px-4 py-2">
                Favorite
              </Button>
            </div>
          </section>

          {/* Usage Examples */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Usage Examples</h2>
            
            <div className="space-y-8">
              {/* Form Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Form Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <SuccessButton>Save Changes</SuccessButton>
                  <Button variant="outline">Cancel</Button>
                  <DangerButton>Reset Form</DangerButton>
                </div>
              </div>

              {/* Card Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Card Actions</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Product Card</h4>
                  <p className="text-gray-600 mb-4">This is a sample product description.</p>
                  <div className="flex gap-3">
                    <Button variant="primary" leftIcon={ShoppingCartIcon}>Add to Cart</Button>
                    <Button variant="outline" leftIcon={HeartIcon}>Wishlist</Button>
                    <Button variant="ghost" leftIcon={EyeIcon}>View Details</Button>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Navigation</h3>
                <div className="flex justify-between">
                  <Button variant="outline">← Previous</Button>
                  <Button variant="primary" rightIcon={ArrowRightIcon}>Next</Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ButtonShowcase;