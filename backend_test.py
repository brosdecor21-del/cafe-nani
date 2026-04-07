#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class CafeNaniAPITester:
    def __init__(self, base_url="https://bird-spirit-cafe.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_seed_data(self):
        """Test data seeding"""
        return self.run_test("Seed Data", "POST", "seed", 200)

    def test_get_coffee_beans(self):
        """Test getting all coffee beans"""
        success, response = self.run_test("Get Coffee Beans", "GET", "coffee-beans", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} coffee beans")
            if len(response) > 0:
                bean = response[0]
                required_fields = ['id', 'name_hu', 'name_en', 'origin', 'price', 'weight']
                missing_fields = [field for field in required_fields if field not in bean]
                if missing_fields:
                    print(f"   ⚠️  Missing fields in bean: {missing_fields}")
                else:
                    print(f"   ✅ Bean structure looks good")
        return success, response

    def test_get_single_coffee_bean(self, bean_id):
        """Test getting a single coffee bean"""
        return self.run_test(f"Get Coffee Bean {bean_id}", "GET", f"coffee-beans/{bean_id}", 200)

    def test_create_coffee_bean(self):
        """Test creating a new coffee bean"""
        test_bean = {
            "name_hu": "Test Kávé",
            "name_en": "Test Coffee",
            "origin": "Test Origin",
            "roast_level": "Medium",
            "flavor_notes_hu": ["Teszt", "Íz"],
            "flavor_notes_en": ["Test", "Flavor"],
            "description_hu": "Test leírás",
            "description_en": "Test description",
            "price": 5000,
            "weight": 250,
            "image_url": "https://example.com/test.jpg",
            "in_stock": True
        }
        return self.run_test("Create Coffee Bean", "POST", "coffee-beans", 200, test_bean)

    def test_get_reviews(self):
        """Test getting all reviews"""
        success, response = self.run_test("Get Reviews", "GET", "reviews", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} reviews")
            if len(response) > 0:
                review = response[0]
                required_fields = ['id', 'author', 'text_hu', 'text_en', 'rating']
                missing_fields = [field for field in required_fields if field not in review]
                if missing_fields:
                    print(f"   ⚠️  Missing fields in review: {missing_fields}")
                else:
                    print(f"   ✅ Review structure looks good")
        return success, response

    def test_create_review(self):
        """Test creating a new review"""
        test_review = {
            "author": "Test User",
            "text_hu": "Teszt vélemény",
            "text_en": "Test review",
            "rating": 5
        }
        return self.run_test("Create Review", "POST", "reviews", 200, test_review)

    def test_get_menu_items(self):
        """Test getting all menu items"""
        success, response = self.run_test("Get Menu Items", "GET", "menu", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} menu items")
            if len(response) > 0:
                item = response[0]
                required_fields = ['id', 'name_hu', 'name_en', 'price', 'category']
                missing_fields = [field for field in required_fields if field not in item]
                if missing_fields:
                    print(f"   ⚠️  Missing fields in menu item: {missing_fields}")
                else:
                    print(f"   ✅ Menu item structure looks good")
        return success, response

    def test_create_menu_item(self):
        """Test creating a new menu item"""
        test_item = {
            "name_hu": "Test Kávé",
            "name_en": "Test Coffee",
            "description_hu": "Test leírás",
            "description_en": "Test description",
            "price": 1000,
            "category": "coffee",
            "image_url": "https://example.com/test.jpg",
            "available": True
        }
        return self.run_test("Create Menu Item", "POST", "menu", 200, test_item)

    def test_contact_form(self):
        """Test contact form submission"""
        test_contact = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test Subject",
            "message": "This is a test message"
        }
        success, response = self.run_test("Contact Form", "POST", "contact", 200, test_contact)
        if success:
            # Check if it's demo mode or real email sent
            if response.get('status') == 'demo':
                print(f"   ℹ️  Contact form in demo mode (Resend API key needed)")
            elif response.get('status') == 'success':
                print(f"   ✅ Email sent successfully")
        return success, response

    def test_invalid_endpoints(self):
        """Test invalid endpoints return 404"""
        success, _ = self.run_test("Invalid Endpoint", "GET", "nonexistent", 404)
        return success

def main():
    print("🚀 Starting Café Nani API Tests")
    print("=" * 50)
    
    tester = CafeNaniAPITester()
    
    # Test API root
    tester.test_api_root()
    
    # Seed data first
    tester.test_seed_data()
    
    # Test coffee beans endpoints
    success, beans = tester.test_get_coffee_beans()
    if success and beans:
        # Test getting a single bean
        first_bean_id = beans[0].get('id')
        if first_bean_id:
            tester.test_get_single_coffee_bean(first_bean_id)
    
    # Test creating a new bean
    success, new_bean = tester.test_create_coffee_bean()
    
    # Test reviews endpoints
    tester.test_get_reviews()
    tester.test_create_review()
    
    # Test menu endpoints
    tester.test_get_menu_items()
    tester.test_create_menu_item()
    
    # Test contact form
    tester.test_contact_form()
    
    # Test invalid endpoints
    tester.test_invalid_endpoints()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"   - {failure.get('test', 'Unknown')}: {failure}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())